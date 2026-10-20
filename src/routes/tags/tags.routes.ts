import {Router} from "express";
import * as tagController from "../../controllers/tags/tag.controller";


const router = Router();

router.get("/", tagController.listTags);

export default router;