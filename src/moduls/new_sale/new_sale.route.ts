import { Router } from "express";
import { NewSaleController } from "./new_sale.controller";
import { NewSaleService } from "./new_sale.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { newSale } from "./new_sale.schema";

const service = new NewSaleService()
const controller = new NewSaleController(service)
const router = Router()

router.post("/sale", authToken, authRole("cashier"), validationBody(newSale), controller.newSale)

export default router