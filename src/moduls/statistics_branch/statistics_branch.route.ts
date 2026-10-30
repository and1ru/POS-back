import { Router } from "express";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";
import { StatisticsBranchService } from "./statistics_branch.service";
import { StatisticsBranchController } from "./statistics_branch.controller";

const service = new StatisticsBranchService()
const controller = new StatisticsBranchController(service)
const router = Router()

router.get("/statistics/branch", authToken, authRole("admin", "owner"), controller.statisticsBranch)

export default router