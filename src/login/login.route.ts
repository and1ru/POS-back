import { Router } from "express";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";

const service = new LoginService()
const controller = new LoginController(service)

const route = Router()

route.post("/login", controller.login)

export default route