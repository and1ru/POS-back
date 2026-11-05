import { Router } from "express";
import { StatisticsCompanyController } from "./statistics_company.controller";
import { StatisticsCompanyService } from "./statistics_company.service";
import { authRole } from "../../middleware/authRole/authRole";
import { authToken } from "../../middleware/authToken/authToken";

const service = new StatisticsCompanyService()
const controller = new StatisticsCompanyController(service)
const router = Router()

router.get("/statistics/company", authToken, authRole("owner"), controller.statisticsCompany)

export default router