import type { NextFunction, Request, Response } from "express";
import type { UpdateEmployeeService } from "./update_employee.service";
import { updateEmployeeSchema } from "./update_employee.schema";

export class UpdateEmployeeController {
    constructor(private service:UpdateEmployeeService){}
    employee = async (req:Request, res:Response, next:NextFunction) => {
        const data = updateEmployeeSchema.safeParse(req.body)
        if(!data.success){
            return next(data.error)
        }

        try {
            const { id, branch, name, role, salary } = data.data
            await this.service.employee(id, branch, name, role, salary)
            return res.status(200).json({ message: "user updated", success:true })
        } catch (error) {
            next(error)
        }
    }
}