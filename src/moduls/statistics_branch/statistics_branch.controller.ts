import type { NextFunction, Request, Response } from "express";
import type { StatisticsBranchService } from "./statistics_branch.service";
import { statisticsBranchSchema } from "./statistics_branch.schema";

export class StatisticsBranchController {
    constructor(private service:StatisticsBranchService){}
    statisticsBranch = async (req:Request ,res:Response, next:NextFunction) => {
        const data = statisticsBranchSchema.safeParse(req.query)
        const { companyId, role, userId } = req.user
        if(!data.success){
            return next(data.error)
        }

        try {
            const { time, branchId } = data.data
            const result = await this.service.statisticsBranch(userId, role, time, companyId, branchId )
            return res.status(200).json({message:"got statistics branch", success:true, result})
        } catch (error) {
            return next(error)
        }
    }
}