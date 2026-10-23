
import { NextFunction, Request, Response } from "express";
import * as LoginAuthService from "../../services/auth/login.service";
import { loginSchema } from "../../validators/auth/auth.validator";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await LoginAuthService.login(input);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
