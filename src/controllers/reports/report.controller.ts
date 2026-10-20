import { NextFunction, Request, Response } from "express";
import * as reportService from "../../services/reports/report.service"


export async function getDepartmentWorkload(req: Request, res: Response, next: NextFunction) {
    try {
       const data = await reportService.getDepartmentWorkload();
       res.status(200).json({success: true, data});
    } catch (error) {
        next(error);
    }
}


export async function getSystemStats(req: Request, res: Response, next: NextFunction) {
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