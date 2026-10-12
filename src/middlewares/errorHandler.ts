import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";
import { env } from "../config/env";

export const errorHandler = (
  err: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = err.flatten().fieldErrors;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = env.isProd ? "Internal server error" : err.message;
  }

  if (statusCode >= 500) {
    logger.error({ err, url: req.originalUrl, method: req.method }, message);
  } else {
    logger.warn({ url: req.originalUrl, method: req.method }, message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.isDev && err instanceof Error ? { stack: err.stack } : {}),
  });
};