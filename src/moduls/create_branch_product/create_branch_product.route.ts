import { Router } from "express";
import { CreateProductController } from "./create_branch_product.controller";
import { CreateProductService } from "./create_branch_product.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { updateProductSchema } from "./create_branch_product.schema";

const service = new CreateProductService();
const controller = new CreateProductController(service);
const route = Router();

route.post("/branch-product", authToken, authRole("admin"), validationBody(updateProductSchema), controller.createProduct);

export default route;