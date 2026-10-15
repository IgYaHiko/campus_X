import { Request, Response, NextFunction } from "express";
import { listComplaintsQuerySchema } from "../../validators/complaints/complaint.validator";
import * as complaintService from "../../services/complaints/complaint.service";


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