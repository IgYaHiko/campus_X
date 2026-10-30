import { NextFunction, Request, Response } from "express";
import * as categoryService from "../../services/categories/category.service";
import {createCategorySchema} from "../../validators/categories/category.validator"
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

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createCategorySchema.parse(req.body);
    const newId = await categoryService.createCategory(input);
    res.status(201).json({success: true, id: newId});
  } catch (error) {
    next(error);
  }
}