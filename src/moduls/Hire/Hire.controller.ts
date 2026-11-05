import type { NextFunction, Request, Response } from "express";
import type { HireSerivce } from "./Hire.service";

export class HireController{
    constructor(private service:HireSerivce){}
    hire = async (req:Request, res:Response, next:NextFunction) => {
        const { branch, email, name, password, role, salary } = req.body
        const {companyId, role:userRole, userId} = req.user

        try {
            await this.service.hire(name, email, password, role, companyId, Number(branch), salary, userRole, userId)
            return res.status(201).json({message:"employee hire", success:true})
        } catch (error) {
            return next(error)
        }
    }
}