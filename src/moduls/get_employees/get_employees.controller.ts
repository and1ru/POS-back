import type { NextFunction, Request, Response } from "express";
import type { EmployeesService } from "./get_employees.service";

export class EmployeesController {
    constructor(private service:EmployeesService){}

    employees = async (req:Request, res:Response, next:NextFunction) => {
        const userRole = req.user?.role
        const userId = req.user?.userId
        const companyId = req.user?.companyId

        if(!userRole || !userId || !companyId){
            return res.status(400).json({message:"no authenticated", success:false})
        }

        try {
            const result = await this.service.employee(userRole, userId, companyId)
            return res.status(200).json({message:"got employees", success:true, result})
        } catch (error) {
            next(error)
        }
    }
}