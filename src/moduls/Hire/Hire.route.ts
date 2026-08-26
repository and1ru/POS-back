import { Router } from "express";
import { HireController } from "./Hire.controller";
import { HireSerivce } from "./Hire.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new HireSerivce()
const controller = new HireController(service)
const route = Router()

route.post("/hire", authToken, authRole("admin", "owner"), controller.hire)

export default route