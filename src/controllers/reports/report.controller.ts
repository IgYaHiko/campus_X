import { NextFunction, Request, Response } from "express";
import * as reportService from "../../services/reports/report.service"
import * as analyticsService from "../../services/reports/analytics.service";



export async function getDepartmentWorkload(_req: Request, res: Response, next: NextFunction) {
    try {
       const data = await reportService.getDepartmentWorkload();
       res.status(200).json({success: true, data});
    } catch (error) {
        next(error);
    }
}


export async function getSystemStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reportService.getSystemStats();
      res.status(200).json({
        success: true,
        data
      })
    } catch (error) {
      next(error)
    }
}


export async function getUnassignedStaff(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getUnassignedStaff();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error)
    }
}

export async function getSilentStudents(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getSilentStudents();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getHighVolumeCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getHighVolumeCategories();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
}