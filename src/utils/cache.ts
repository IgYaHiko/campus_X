import { redis } from "../config/redis";
import { logger } from "../config/logger";

const DEFAULT_TTL = 60; // seconds

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      logger.warn({ err, key }, "Cache get failed");
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = DEFAULT_TTL): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (err) {
      logger.warn({ err, key }, "Cache set failed");
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (err) {
      logger.warn({ err, key }, "Cache del failed");
    }
  },

  /**
   * Cache-aside pattern.
   * Try cache → on miss run fetcher → store result → return.
   */
  async wrap<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  },

  /**
   * Delete every key matching a pattern.
   * Uses SCAN (non-blocking) instead of KEYS (blocks Redis).
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      let cursor = "0";
      do {
        const [next, keys] = await redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100
        );
        cursor = next;
        if (keys.length) await redis.del(...keys);
      } while (cursor !== "0");
    } catch (err) {
      logger.warn({ err, pattern }, "Cache invalidate failed");
    }
  },
};