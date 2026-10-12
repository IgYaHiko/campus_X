import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { redis } from "./config/redis";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(`🚀 CampusFix server running on http://localhost:${env.PORT}`);
  logger.info(`🌱 Environment: ${env.NODE_ENV}`);
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled Rejection — shutting down");
  server.close(() => process.exit(1));
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught Exception — shutting down");
  process.exit(1);
});



const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        await redis.quit();
        logger.info("Redis connection closed");
        process.exit(0);
      });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));