import { Router } from "express";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";
import { StatisticsEmployeeController } from "./statistics_employee.controller";
import { StatisticsEmployeeService } from "./statistics_employee.service";

const service = new StatisticsEmployeeService()
const controller = new  StatisticsEmployeeController(service)
const router = Router()

router.get("/statistics/employee", authToken, authRole("admin", "owner"), controller.statisticsEmployee)

export default router