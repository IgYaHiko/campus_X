import { NextFunction, Request, Response } from "express";
import { registerSchema } from "../../validators/auth/auth.validator";
import * as RegisterAuthService from "../../services/auth/register.service";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await RegisterAuthService.register(input);

      res.status(201).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
}