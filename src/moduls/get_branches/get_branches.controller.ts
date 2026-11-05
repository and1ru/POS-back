import type { NextFunction, Request, Response } from "express";
import type { GetBranchesService } from "./get_branches.service";

export class GetBranchesController {
    constructor(private service:GetBranchesService){}
    getBranches = async (req:Request, res:Response, next:NextFunction) => {
        const {companyId} = req.user

        try {
            const response = await this.service.getBranches(companyId)
            return res.status(200).json({message:"got branches", status:true, result:response})
        } catch (error) {
            return next(error)
        }
    }
}