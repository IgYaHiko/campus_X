import { NextFunction, Request, Response } from "express";
import * as StaffService from "../../services/staff/staff.service";
import { updateAdminProfileSchema } from "../../validators/staff/staff-validator";
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





export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.user!.sub;
    const profile = await StaffService.getAdminProfile(adminId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.user!.sub;
    const input = updateAdminProfileSchema.parse(req.body);
    const updated = await StaffService.updateAdminProfile(adminId, input);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}