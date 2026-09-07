import type { NextFunction, Request, Response } from "express";
import { hireSchema } from "./Hire.schema";
import type { HireSerivce } from "./Hire.service";

export class HireController{
    constructor(private service:HireSerivce){}
    hire = async (req:Request, res:Response, next:NextFunction) => {
        const data = hireSchema.safeParse(req.body)
        const companyId = req.user?.companyId
        if(!companyId){
            return res.status(401).json({message:"", success:false})
        }
        if(!data.success){
            return next(data.error)
        }
        
        try {
            const { branch, email, name, password, role } = data.data
            await this.service.hire(name, email, password, role, companyId, Number(branch))
            return res.status(201).json({message:"employee hire", success:true})
        } catch (error) {
            next(error)
        }
    }
}