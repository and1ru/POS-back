import { Router } from "express";
import { AuthController } from "./Auth.controller";
import { AuthService } from "./Auth.service";
import { authToken } from "../middleware/authToken";

const service = new AuthService()
const controller = new AuthController(service)
const route = Router()

route.get("/auth",authToken, controller.auth)

export default route