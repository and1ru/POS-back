import { Router } from "express";
import { NewSaleController } from "./new_sale.controller";
import { NewSaleService } from "./new_sale.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new NewSaleService()
const controller = new NewSaleController(service)
const router = Router()

router.post("/sale", authToken, authRole("cashier"), controller.newSale)

export default router