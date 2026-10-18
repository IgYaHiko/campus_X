import { Request, Response, NextFunction } from "express";
import { complaintIdParamSchema, createCommentSchema, createComplaintSchema, listComplaintsQuerySchema, updateComplaintStatusSchema } from "../../validators/complaints/complaint.validator";
import * as complaintService from "../../services/complaints/complaint.service";
import { ApiError } from "../../utils/ApiError";
import { input } from "zod";


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


export async function createComplaint(req: Request, res: Response, next: NextFunction) {
        try {
          const body = createComplaintSchema.parse(req.body);
          const complaint = await complaintService.createComplaints(body);

          res
          .status(201)
          .location(`/api/v1/complaints${complaint!.id}`)
          .json({ success: true, data: complaint });
          
        } catch (error) {
          next(error)
        }
}


export async function updateComplaintStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = complaintIdParamSchema.parse(req.params);
      const input = updateComplaintStatusSchema.parse(req.body);

      const complaints = await complaintService.updateComplaintStatus(id, input);

      res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      next(error);
    }   
}   


export async function createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = complaintIdParamSchema.parse(req.params);
      const input = createCommentSchema.parse(req.body);


      const comment = await complaintService.createComment(id, input);

      res
      .status(201)
      .location(`/api/v1/complaints/${id}/comments/${comment.id}`)
      .json({ success: true, data: comment });

    } catch (error) {
      next(error)
    }
}