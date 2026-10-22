import express, { Application, Request, Response } from "express";
import apiRoutes from "./routes"
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./config/logger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { redis } from "./config/redis";
import { pingDB } from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
const app: Application = express();

// Request logging — quiet by default, loud on errors
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === "/health",
    },
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "debug";
    },
  })
);

// Cors middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: System health check
 *     responses:
 *       200:
 *         description: Returns API, Redis, and MySQL status
 */

// Health check route
app.get("/health", async (_req: Request, res: Response) => {
  let redisStatus = "down";
  try {
    const pong = await redis.ping();
    if (pong === "PONG") redisStatus = "up";
  } catch {
    redisStatus = "down";
  }


  const dbUp = await pingDB();

  res.status(200).json({
    status: "ok",
    message: "CampusFix API is running",
    services: {
      api: "up",
      redis: redisStatus,
      mysql: dbUp ? "up" : "down",
    },
    timestamp: new Date().toISOString(),
  });
});




app.use("/api/v1", apiRoutes)

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "CampusFix API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// Also expose the raw JSON spec (useful for client generators)
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 404 handler — after all routes
app.use(notFound);

// Central error handler — MUST be last
app.use(errorHandler);

export default app;