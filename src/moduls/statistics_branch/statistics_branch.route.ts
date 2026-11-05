import { Router } from "express";
import { StatisticsBranchService } from "./statistics_branch.service";
import { StatisticsBranchController } from "./statistics_branch.controller";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";

const service = new StatisticsBranchService()
const controller = new StatisticsBranchController(service)
const router = Router()

router.get("/statistics/branch", authToken, authRole("owner", "admin"), controller.statisticsBranch)

export default router