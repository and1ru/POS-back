import { Router } from "express";
import { HireController } from "./Hire.controller";
import { HireSerivce } from "./Hire.service";
import { authRole } from "../../middleware/authRole/authRole";
import { authToken } from "../../middleware/authToken/authToken";
import { validationBody } from "../../middleware/validationBody";
import { hireSchema } from "./Hire.schema";

const service = new HireSerivce()
const controller = new HireController(service)
const route = Router()

route.post("/hire", authToken, authRole("admin", "owner"), validationBody(hireSchema), controller.hire)

export default route