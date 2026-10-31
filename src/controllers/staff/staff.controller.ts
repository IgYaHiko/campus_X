import { NextFunction, Request, Response } from "express";
import * as StaffService from "../../services/staff/staff.service";
export async function getAllStaff(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await StaffService.getAllStaffData();
      res.status(200).json({
        success: true, 
        data    
      });
    } catch (error) {
      next(error);
    }
}


