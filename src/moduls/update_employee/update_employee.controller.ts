import type { NextFunction, Request, Response } from "express";
import type { UpdateEmployeeService } from "./update_employee.service";

export class UpdateEmployeeController {
    constructor(private service:UpdateEmployeeService){}
    employee = async (req:Request, res:Response, next:NextFunction) => {
        const { id, branch, name, role, salary } = req.body

        try {
            await this.service.employee(id, branch, name, role, salary)
            return res.status(200).json({ message: "user updated", success:true })
        } catch (error) {
            return next(error)
        }
    }
}