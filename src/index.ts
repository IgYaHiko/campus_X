import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

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

// Graceful shutdown on SIGTERM/SIGINT
process.on("SIGTERM", () => {
  logger.info("SIGTERM received — closing server");
  server.close(() => process.exit(0));
});
process.on("SIGINT", () => {
  logger.info("SIGINT received — closing server");
  server.close(() => process.exit(0));
});