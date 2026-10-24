import type { NextFunction, Response, Request } from "express";
import type { GetEmployeeService } from "./get_employee.service";

export class GetEmployeeController {
    constructor(private service:GetEmployeeService){}
    employee = async (req:Request, res:Response, next:NextFunction) => {
        const employeeId = req.params.employeeId
        const { companyId, role, userId } = req.user

        if(!employeeId){
            return res.status(400).json({ message: "employeeId is required", success:false })
        }

        try {
            const result = await this.service.employee(Number(employeeId), companyId, role, userId)
            return res.status(200).json({ message:"got employee", success:true, result })
        } catch (error) {
            next(error)
        }
    }
}