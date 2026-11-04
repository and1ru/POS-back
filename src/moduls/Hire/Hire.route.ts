import { Router } from "express";
import { HireController } from "./Hire.controller";
import { HireSerivce } from "./Hire.service";
import { authRole } from "../../middleware/authRole/authRole";
import { authToken } from "../../middleware/authToken/authToken";

const service = new HireSerivce()
const controller = new HireController(service)
const route = Router()

route.post("/hire", authToken, authRole("admin", "owner"), controller.hire)

export default route