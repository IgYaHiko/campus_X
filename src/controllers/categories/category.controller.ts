import { NextFunction, Request, Response } from "express";
import * as categoryService from "../../services/categories/category.service";

export async function listCategories(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await categoryService.listCategories();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}