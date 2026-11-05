import type { NextFunction, Request, Response } from "express";
import type { CreateBranchService } from "./create_branch.service";

export class CreateBranchController{
    constructor(private service:CreateBranchService){}
    createBranch = async (req:Request, res:Response, next:NextFunction) => {
        const { companyId } = req.user
        const { address, city, name} = req.body

        try {
            await this.service.createBranch(address, city, name, companyId)
            return res.status(201).json({message:"branch created", success:true})
        } catch (error) {
            return next(error)
        }
    }
}