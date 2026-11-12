import { Router } from "express";
import { UpdateBranchProductController } from "./update_branch_product.controller";
import { UpdateBranchProductService } from "./update_branch_product.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { updateProductSchema } from "./update_branch_product.schema";

const service = new UpdateBranchProductService()
const controller = new UpdateBranchProductController(service)
const route = Router()

route.put("/branch-product", authToken, authRole("admin"), validationBody(updateProductSchema), controller.updateBranchProduct)

export default route