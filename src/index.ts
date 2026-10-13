import app from "./app";
import { closeDB, pingDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { redis } from "./config/redis";

const server = app.listen(env.PORT, "0.0.0.0", async () => {
  logger.info(`🚀 CampusFix server running on http://localhost:${env.PORT}`);
  logger.info(`🌱 Environment: ${env.NODE_ENV}`);

  const dbOk =  await pingDB();
  if (dbOk) logger.info(`✅ MySQL connected → ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  else logger.error(`❌ MySQL connection failed → ${env.DB_HOST}:${env.DB_PORT}`);

  
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
    await closeDB();
    logger.info("Connections closed. Bye 👋");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));