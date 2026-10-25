import { Request, Response, NextFunction } from "express";
import { assignComplaintSchema, attachTagSchema, complaintIdParamSchema, createCommentSchema, createComplaintSchema, listComplaintsQuerySchema, tagSlugParamSchema, updateComplaintStatusSchema } from "../../validators/complaints/complaint.validator";
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


export async function createComplaint(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createComplaintSchema.parse(req.body);
    
    // req.user is guaranteed to exist because of the requireAuth middleware
    const studentId = req.user!.sub;

    // Pass the studentId as the second argument
    const complaint = await complaintService.createComplaints(body, studentId);

    res
      .status(201)
      .location(`/api/v1/complaints/${complaint!.id}`)
      .json({ success: true, data: complaint });
  } catch (err) {
    next(err);
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
      const { id } = complaintIdParamSchema.parse(req.params);
      const input = createCommentSchema.parse(req.body);

         // Enforce identity based on token
     if (req.user!.role === "student") {
        input.commenterType = "student";
        input.studentId = req.user!.sub;
        input.staffId = undefined;
    } else if (req.user!.role === "staff" || req.user!.role === "admin") {
        input.commenterType = "staff";
        input.staffId = req.user!.sub;
        input.studentId = undefined;
        }

      const comment = await complaintService.createComment(id, input);

      res
      .status(201)
      .location(`/api/v1/complaints/${id}/comments/${comment.id}`)
      .json({ success: true, data: comment });

    } catch (error) {
      next(error)
    }
}

export async function attachTags(req:Request, res: Response, next: NextFunction) {
    try {
      const {id} = complaintIdParamSchema.parse(req.params);
      const input = attachTagSchema.parse(req.body);

      const tags = await complaintService.attachTag(id, input);
      res.status(201).json({
        success: true,
        data: tags
      })
    } catch (error) {
      next(error);
    }
}


export async function detachTags(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, tagSlug } = tagSlugParamSchema.parse(req.params);

      const result = await complaintService.detachTag(id,tagSlug);

      res.status(200).json({
        success: true,
        ...result
      })
    } catch (error) {
      next(error);
    }
}

export async function assignComplaint(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = complaintIdParamSchema.parse(req.params);
    const input = assignComplaintSchema.parse(req.body);

    // override the admin email with the one from the token
    input.adminEmail = req.user!.email;

    const complaint = await complaintService.assignComplaint(id, input);
    res.status(200).json({ success: true, data: complaint });
  } catch (err) {
    next(err);
  }
}



export async function listMyComplaints(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = req.user!.sub;
    const query = listComplaintsQuerySchema.parse(req.query);
    const result = await complaintService.listMyComplaints(studentId, query);
    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    next(error)
  }
}