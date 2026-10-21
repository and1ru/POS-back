import { Router } from "express";
import { GetEmployeeController } from "./get_employee.controller";
import { GetEmployeeService } from "./get_employee.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new GetEmployeeService()
const controller = new GetEmployeeController(service)
const router = Router()

router.get("/employee/employeeId", authToken, authRole("owner", "admin"), controller.employee)

export default router