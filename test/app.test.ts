
import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../src/app";
import { redis } from "../src/config/redis";
import { pingDB } from "../src/config/db";

vi.mock("../src/config/redis", () => ({
  redis: {
    ping: vi.fn(),
  },
}));

vi.mock("../src/config/db", () => ({
  pingDB: vi.fn(),
  closeDB: vi.fn(),
}));

vi.mock("../src/routes", () => ({
  default: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock("../src/config/swagger", () => ({
  swaggerSpec: {},
}));

describe("CampusFix API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /health", () => {
    it("returns healthy status when MySQL and Redis are up", async () => {
      vi.mocked(redis.ping).mockResolvedValue("PONG");
      vi.mocked(pingDB).mockResolvedValue(true);

      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: "ok",
        message: "CampusFix API is running",
        services: {
          api: "up",
          redis: "up",
          mysql: "up",
        },
      });

      expect(response.body.timestamp).toBeDefined();
      expect(redis.ping).toHaveBeenCalledOnce();
      expect(pingDB).toHaveBeenCalledOnce();
    });

    it("reports Redis as down when its ping fails", async () => {
      vi.mocked(redis.ping).mockRejectedValue(new Error("Redis unavailable"));
      vi.mocked(pingDB).mockResolvedValue(true);

      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.services.redis).toBe("down");
      expect(response.body.services.mysql).toBe("up");
    });

    it("reports MySQL as down when the database ping fails", async () => {
      vi.mocked(redis.ping).mockResolvedValue("PONG");
      vi.mocked(pingDB).mockResolvedValue(false);

      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.services.redis).toBe("up");
      expect(response.body.services.mysql).toBe("down");
    });

    it("reports both dependencies as down when both are unavailable", async () => {
      vi.mocked(redis.ping).mockRejectedValue(new Error("Redis unavailable"));
      vi.mocked(pingDB).mockResolvedValue(false);

      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.services).toEqual({
        api: "up",
        redis: "down",
        mysql: "down",
      });
    });
  });

  describe("Unknown routes", () => {
    it("returns 404 for a nonexistent endpoint", async () => {
      const response = await request(app).get("/route-that-does-not-exist");

      expect(response.status).toBe(404);
    });
  });
});
