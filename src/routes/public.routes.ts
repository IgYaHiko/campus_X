import { Router } from "express";
import { requireLandingSession } from "../middlewares/requireLandingSession";
import {
  getLandingMe,
  logoutLanding,
} from "../controllers/auth/handoff.controller";

const router = Router();

router.get("/me", requireLandingSession, getLandingMe);

router.post("/logout", requireLandingSession, logoutLanding);

export default router;