import { Router } from "express";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";

const service = new InventoryService()
const controller = new InventoryController(service)
const route = Router()

route.get("/inventory", authToken, authRole("admin", "cashier", "owner"), controller.inventory)

export default route