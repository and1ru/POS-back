import { Router } from "express";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { authToken } from "../../middleware/authToken";

const service = new HistoryService()
const controller = new HistoryController(service)
const router = Router()

router.get("/history", authToken, controller.history)

export default router