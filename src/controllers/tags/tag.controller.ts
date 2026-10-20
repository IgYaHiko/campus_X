import { NextFunction, Request, Response } from "express";
import * as tagService from "../../services/tags/tag.service";
import {
  attachTagSchema,
  complaintIdParamSchema,
  tagSlugParamSchema,
} from "../../validators/complaints/complaint.validator";

import * as  complaintService from "../../services/complaints/complaint.service"
export async function listTags(req: Request,
     res: Response, next: NextFunction
) {
    try {
      const data =  await tagService.listTags();
      res.status(200).json({ success: true, data });
    } catch(error) {
        next(error)
    }
}

