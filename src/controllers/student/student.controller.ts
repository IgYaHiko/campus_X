import { Request, Response, NextFunction } from "express";
import * as studentService from "../../services/student/student.service";
import { updateStudentProfileSchema } from "../../validators/student/student.validator";


export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = req.user!.sub;
    const profile = await studentService.getMyProfile(studentId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = req.user!.sub;
    const input = updateStudentProfileSchema.parse(req.body);
    
    const updatedProfile = await studentService.updateMyProfile(studentId, input);
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (err) {
    next(err);
  }
}