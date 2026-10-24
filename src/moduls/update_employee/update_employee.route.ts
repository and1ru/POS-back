import { Router } from "express";
import { UpdateEmployeeController } from "./update_employee.controller";
import { UpdateEmployeeService } from "./update_employee.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new UpdateEmployeeService()
const controller = new UpdateEmployeeController(service)
const router = Router()

router.put("/employee", authToken, authRole("admin", "owner"), controller.employee)

export default router