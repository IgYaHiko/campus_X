
import { Request, Response, NextFunction } from "express";
import {
  createHandoff,
  exchangeHandoff,
} from "../../services/auth/handoff.service";
import {
  createLandingSession,
  destroyLandingSession,
  getLandingSession,
} from "../../services/auth/landing-session.service";
import { ApiError } from "../../utils/ApiError";
import { env } from "../../config/env";
import { db } from "../../db/client";
import { students } from "../../db/schema/students";
import { staff } from "../../db/schema/staff";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "sayso_landing_session";

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "lax" as const,
  path: "/",
};

export async function generateHandoff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const result = await createHandoff(req.user);

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function exchangeHandoffCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      throw ApiError.badRequest("Handoff code is required");
    }

    // Redeem the one-time handoff code
    const user = await exchangeHandoff(code);

    // Verify student account exists and is active
    if (user.role === "student") {
      const [student] = await db
        .select({
          id: students.id,
          isActive: students.isActive,
        })
        .from(students)
        .where(eq(students.id, user.sub))
        .limit(1);

      if (!student || !student.isActive) {
        throw ApiError.unauthorized("Student account is inactive or unavailable");
      }
    } else {
      // Verify staff/admin account exists and is active
      const [staffMember] = await db
        .select({
          id: staff.id,
          isActive: staff.isActive,
        })
        .from(staff)
        .where(eq(staff.id, user.sub))
        .limit(1);

      if (!staffMember || !staffMember.isActive) {
        throw ApiError.unauthorized("Staff account is inactive or unavailable");
      }
    }

    // Create independent landing session
    const session = await createLandingSession(user);

    res.cookie(COOKIE_NAME, session.sessionId, {
      ...cookieOptions,
      maxAge: session.expiresIn * 1000,
    });

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Landing session established",
    });
  } catch (error) {
    next(error);
  }
}

export async function getLandingMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];
    const session = await getLandingSession(sessionId);

    if (!session) {
      throw ApiError.unauthorized("Landing session expired");
    }

    // Return student profile
    if (session.role === "student") {
      const [student] = await db
        .select({
          id: students.id,
          name: students.name,
          email: students.email,
          rollNumber: students.rollNumber,
          branch: students.branch,
          isActive: students.isActive,
        })
        .from(students)
        .where(eq(students.id, session.sub))
        .limit(1);

      if (!student || !student.isActive) {
        throw ApiError.unauthorized("Student account is inactive or unavailable");
      }

      res.setHeader("Cache-Control", "no-store");

      return res.status(200).json({
        success: true,
        data: {
          id: student.id,
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber,
          branch: student.branch,
          role: "student",
        },
      });
    }

    // Return staff/admin profile
    const [staffMember] = await db
      .select({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        isActive: staff.isActive,
      })
      .from(staff)
      .where(eq(staff.id, session.sub))
      .limit(1);

    if (!staffMember || !staffMember.isActive) {
      throw ApiError.unauthorized("Staff account is inactive or unavailable");
    }

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      data: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutLanding(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];

    if (sessionId) {
      await destroyLandingSession(sessionId);
    }

    res.clearCookie(COOKIE_NAME, cookieOptions);

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}
