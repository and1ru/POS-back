import { Router } from "express";
import { UpdateProductController } from "./update_product.controller";
import { UpdateProductService } from "./update_product.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";
import { uploadImage } from "../../middleware/imageMiddleware";

const service = new UpdateProductService()
const controller = new UpdateProductController(service)
const router = Router()

router.patch("/product", authToken, authRole("owner"), uploadImage.single("images"), controller.updateProduct)

export default router