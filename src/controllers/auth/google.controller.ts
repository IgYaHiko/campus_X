import { NextFunction, Request, Response } from "express";
import * as GoogleAuthService from "../../services/auth/google-Oauth.service";
import {googleAuthSchema} from "../../validators/auth/auth.validator"


export async function googleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = googleAuthSchema.parse(req.body);
    const result = await GoogleAuthService.googleLogin(input);

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}
