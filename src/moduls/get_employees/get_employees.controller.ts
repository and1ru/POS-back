import type { NextFunction, Request, Response } from "express";
import type { EmployeesService } from "./get_employees.service";

export class EmployeesController {
    constructor(private service:EmployeesService){}

    employees = async (req:Request, res:Response, next:NextFunction) => {
        const { companyId, userId, role} = req.user
        const { employeeName, employeeRole, employeeBranch } = req.query

        if(
            (typeof employeeName !== "string" && employeeName !== undefined) ||
            (typeof employeeRole !== "string" && employeeRole !== undefined) ||
            (typeof employeeBranch !== "string" && employeeBranch !== undefined)
        ){
            return res.status(400).json({ message: "", success: false })
        }

        try {
            const result = await this.service.employee(role, userId, companyId, employeeName, employeeRole, employeeBranch)
            return res.status(200).json({message:"got employees", success:true, result})
        } catch (error) {
            next(error)
        }
    }
}