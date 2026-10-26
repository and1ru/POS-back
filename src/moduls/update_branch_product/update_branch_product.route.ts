import { Router } from "express";
import { UpdateProductController } from "./update_branch_product.controller";
import { UpdateProductService } from "./update_branch_product.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new UpdateProductService()
const controller = new UpdateProductController(service)
const route = Router()

route.put("/branch-product", authToken, authRole("admin"), controller.updateProduct)

export default route