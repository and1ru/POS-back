import { Router } from "express";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { authToken } from "../../middleware/authToken/authToken";

const service = new InventoryService()
const controller = new InventoryController(service)
const route = Router()

route.get("/inventory", authToken, controller.inventory)

export default route