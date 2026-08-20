import { Router } from "express";
import { LogOutController } from "./logOut.controller";

const controller = new LogOutController()
const route = Router()

route.post("/logOut", controller.logOut)

export default route