import type { NextFunction, Request, Response } from "express";
import type { StatisticsProductsService } from "./statistics_products.service";
import { statisticsProductsSchema } from "./statistics_products.schema";

// recivira name del product - tiempo - branch

export class StatisticsProductsController {
    constructor(private service: StatisticsProductsService) { }
    statisticsProducts = async (req: Request, res: Response, next: NextFunction) => {
        const data = statisticsProductsSchema.safeParse(req.query)
        const { role, userId, companyId } = req.user
        if (!data.success) {
            return next(data.error)
        }

        try {
            const { branchId, name, time } = data.data
            const result = await this.service.statisticsProducts(userId, role, companyId, time, branchId, name)
            return res.status(200).json({ message: "got statistics", success: true, result })
        } catch (error) {
            return next(error)
        }
    }
}