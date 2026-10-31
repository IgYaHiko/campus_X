import { Request, Response, NextFunction } from "express";
import * as departmentService from "../../services/department/department.service";
import { createDepartmentSchema } from "../../validators/department/department.validator";

export async function listDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await departmentService.listDepartments();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createDepartmentSchema.parse(req.body);
    const department = await departmentService.createDepartment(input);
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
}