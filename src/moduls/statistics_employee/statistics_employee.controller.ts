import type { NextFunction, Response, Request } from "express";
import type { StatisticsEmployeeService } from "./statistics_employee.service";
import { statisticsEmployeeSchema } from "./statistics_employee.schema";

export class StatisticsEmployeeController {
    constructor(private service:StatisticsEmployeeService){}
    statisticsEmployee = async (req:Request, res:Response, next:NextFunction) => {
        const { companyId, userId, role } = req.user
        const data = statisticsEmployeeSchema.safeParse(req.query)

        if(!data.success){
            return next(data.error)
        }

        try {
            const { time, branchId, name } = data.data
            const result = await this.service.statisticsEmployee(role, time, companyId, userId, name, branchId)
            // console.log(result)
            return res.status(200).json({message:"got statistics employees", success:true, result})
        } catch (error) {
            return next(error)
        }
    }
}