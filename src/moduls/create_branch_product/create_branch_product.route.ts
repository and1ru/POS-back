import { Router } from "express";
import { CreateProductController } from "./create_branch_product.controller";
import { CreateProductService } from "./create_branch_product.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new CreateProductService();
const controller = new CreateProductController(service);
const route = Router();

route.post("/branch-product", authToken, authRole("admin"), controller.createProduct);

export default route;
