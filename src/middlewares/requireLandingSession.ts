
import { Request, Response, NextFunction } from "express";
import { getLandingSession } from "../services/auth/landing-session.service";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      landingUser?: {
        sub: number;
        role: "student" | "staff" | "admin";
      };
    }
  }
}

export async function requireLandingSession(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const sessionId = req.cookies?.sayso_landing_session;

    const session = await getLandingSession(sessionId);

    if (!session) {
      throw ApiError.unauthorized("Landing authentication required");
    }

    req.landingUser = session;

    next();
  } catch (error) {
    next(error);
  }
}
