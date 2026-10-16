import { Request, Response, NextFunction } from "express";
import { complaintIdParamSchema, listComplaintsQuerySchema } from "../../validators/complaints/complaint.validator";
import * as complaintService from "../../services/complaints/complaint.service";
import { ApiError } from "../../utils/ApiError";


export async function listComplaints(req: Request, res: Response, next: NextFunction) {
    try {

       // Parse & validate query string
       const query = listComplaintsQuerySchema.parse(req.query);
       // Delegate to service
       const result = await complaintService.listComplaints(query);

        // send the response from the server
        res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {
        next(error);
    }
}


export async function getComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = complaintIdParamSchema.parse(req.params);
      const complaint = await complaintService.getComplaintById(id);

     // if not found throw a error
      if (!complaint) {
      throw ApiError.notFound(`Complaint with id ${id} not found`);
        }

    // success 
    res.status(200).json({ success: true, data: complaint });
    } catch (error) {
      next(error)
    }
}