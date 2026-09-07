import { Router } from "express";
import { EmployeesController } from "./get_employees.controller";
import { EmployeesService } from "./get_employees.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new EmployeesService()
const controller = new EmployeesController(service)
const route = Router()

route.get("/employees", authToken, authRole("owner", "admin"), controller.employees)

export default route