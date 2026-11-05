
import { createHash, randomBytes } from "crypto";
import { redis } from "../../config/redis";
import { ApiError } from "../../utils/ApiError";
import type { JwtPayload } from "../../types/auth.types";

const HANDOFF_TTL = 60;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function createHandoff(user: JwtPayload) {
  const code = randomBytes(32).toString("base64url");
  const codeHash = hash(code);

  const stored = await redis.set(
    `sso:handoff:${codeHash}`,
    JSON.stringify({
      sub: user.sub,
      role: user.role,
    }),
    "EX",
    HANDOFF_TTL,
    "NX"
  );

  if (stored !== "OK") {
    throw ApiError.internal("Unable to create handoff");
  }

  return {
    code,
    expiresIn: HANDOFF_TTL,
  };
}

export async function exchangeHandoff(code: string) {
  if (!code || code.length > 200) {
    throw ApiError.badRequest("Invalid handoff code");
  }

  const codeHash = hash(code);
  const key = `sso:handoff:${codeHash}`;

  // Atomic GET + DELETE prevents concurrent redemption.
  const script = `
    local value = redis.call("GET", KEYS[1])
    if value then
      redis.call("DEL", KEYS[1])
    end
    return value
  `;

  const result = await redis.eval(script, 1, key);

  if (!result || typeof result !== "string") {
    throw ApiError.unauthorized("Invalid or expired handoff code");
  }

  return JSON.parse(result) as {
    sub: number;
    role: JwtPayload["role"];
  };
}
