import { Router } from "express";
import { UpdateProductController } from "./update_product.controller";
import { UpdateProductService } from "./update_product.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new UpdateProductService()
const controller = new UpdateProductController(service)
const router = Router()

router.put("/product", authToken, authRole("owner"), controller.updateProduct)

export default router