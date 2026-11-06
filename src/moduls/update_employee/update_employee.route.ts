import { Router } from "express";
import { UpdateEmployeeController } from "./update_employee.controller";
import { UpdateEmployeeService } from "./update_employee.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { updateEmployeeSchema } from "./update_employee.schema";

const service = new UpdateEmployeeService()
const controller = new UpdateEmployeeController(service)
const router = Router()

router.put("/employee", authToken, authRole("admin", "owner"), validationBody(updateEmployeeSchema), controller.employee)

export default router