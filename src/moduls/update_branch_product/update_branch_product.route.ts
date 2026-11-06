import { Router } from "express";
import { UpdateProductController } from "./update_branch_product.controller";
import { UpdateProductService } from "./update_branch_product.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { updateProductSchema } from "./update_branch_product.schema";

const service = new UpdateProductService()
const controller = new UpdateProductController(service)
const route = Router()

route.put("/branch-product", authToken, authRole("admin"), validationBody(updateProductSchema), controller.updateProduct)

export default route