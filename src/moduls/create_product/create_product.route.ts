import { Router } from "express";
import { CreateProductController } from "./create_product.controller";
import { CreateProductService } from "./create_product.service";
import { uploadImage } from "../../middleware/imageMiddleware";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new CreateProductService()
const controller = new CreateProductController(service)
const route = Router()

route.post("/create-product", authToken, authRole("owner"), uploadImage.single("image"), controller.createProduct)

export default route