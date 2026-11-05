import { Router } from "express";
import { StatisticsEmployeeController } from "./statistics_employee.controller";
import { StatisticsEmployeeService } from "./statistics_employee.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";

const service = new StatisticsEmployeeService()
const controller = new  StatisticsEmployeeController(service)
const router = Router()

router.get("/statistics/employee", authToken, authRole("admin", "owner"), controller.statisticsEmployee)

export default router