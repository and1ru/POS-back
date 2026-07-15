import { Router } from "express";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";

const service = new RegisterService()
const controller = new RegisterController(service)

const route = Router()

route.post("/register", controller.register)

export default route