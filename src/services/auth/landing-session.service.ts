
import { createHash, randomBytes } from "crypto";
import { redis } from "../../config/redis";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import type { JwtPayload } from "../../types/auth.types";

const SESSION_TTL = env.LANDING_SESSION_TTL;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function createLandingSession(user: {
  sub: number;
  role: JwtPayload["role"];
}) {
  const sessionId = randomBytes(32).toString("base64url");
  const sessionHash = hash(sessionId);

  const result = await redis.set(
    `sso:session:${sessionHash}`,
    JSON.stringify(user),
    "EX",
    SESSION_TTL,
    "NX"
  );

  if (result !== "OK") {
    throw ApiError.internal("Failed to create landing session");
  }

  return {
    sessionId,
    expiresIn: SESSION_TTL,
  };
}

export async function getLandingSession(sessionId: string) {
  if (!sessionId || sessionId.length > 200) {
    return null;
  }

  const user = await redis.get(
    `sso:session:${hash(sessionId)}`
  );

  if (!user) return null;

  try {
    return JSON.parse(user) as {
      sub: number;
      role: JwtPayload["role"];
    };
  } catch {
    return null;
  }
}

export async function destroyLandingSession(sessionId: string) {
  if (!sessionId || sessionId.length > 200) return;

  await redis.del(`sso:session:${hash(sessionId)}`);
}
