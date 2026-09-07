import { Router } from "express";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { validationBody } from "../../middleware/validationBody";
import { loginSchema } from "./login.schema";

const service = new LoginService()
const controller = new LoginController(service)

const route = Router()

route.post("/login", validationBody(loginSchema), controller.login)

export default route