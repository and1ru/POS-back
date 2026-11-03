import type { NextFunction, Request, Response } from "express";
import type { StatisticsCompanyService } from "./statistics_company.service";
import { CustomError } from "../../helper/cutomError";

export class StatisticsCompanyController {
    constructor(private service: StatisticsCompanyService) { }
    statisticsCompany = async (req: Request, res: Response, next: NextFunction) => {
        const { time } = req.query
        const { companyId } = req.user

        if (typeof time !== "string") {
            throw new CustomError(400, "time is not valid or required")
        }

        try {
            const result = await this.service.statisticsCompany(time, companyId)
            return res.status(200).json({ message: "got company statistics", success: true, result })
        } catch (error) {
            return next(error)
        }
    }
}