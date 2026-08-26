import type { NextFunction, Request, Response } from "express";
import { branchSchema } from "./create_branch.schema";
import type { CreateBranchService } from "./create_branch.service";
import { CustomError } from "../../helper/cutomError";

export class CreateBranchController{
    constructor(private service:CreateBranchService){}
    createBranch = async (req:Request, res:Response, next:NextFunction) => {
        const companyId = req.user?.companyId
        const data = branchSchema.safeParse(req.body)
        if(!data.success){
            return next(data.error)
        }
        if(!companyId){
            return next(new CustomError(401, "no authenticated"))
        }

        try {
            const { address, city, name } = data.data
            await this.service.createBranch(address, city, name, companyId)
            return res.status(201).json({message:"branch created", success:true})
        } catch (error) {
            next(error)
        }
    }
}