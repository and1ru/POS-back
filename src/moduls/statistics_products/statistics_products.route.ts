import { Router } from "express";
import { StatisticsProductsController } from "./statistics_products.controller";
import { StatisticsProductsService } from "./statistics_products.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new StatisticsProductsService()
const controller = new StatisticsProductsController(service)
const router = Router()

router.get("/statistics/products", authToken, authRole("admin", "owner"), controller.statisticsProducts)

export default router