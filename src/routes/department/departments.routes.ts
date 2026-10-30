import { Router } from "express";
import { db } from "../../db/client";
import { departments } from "../../db/schema/department";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await db.select().from(departments);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;