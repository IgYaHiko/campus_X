import { NextFunction, Request, Response } from "express";
import * as tagService from "../../services/tags/tag.service";


export async function listTags(_req: Request,
     res: Response, next: NextFunction
) {
    try {
      const data =  await tagService.listTags();
      res.status(200).json({ success: true, data });
    } catch(error) {
        next(error)
    }
}

