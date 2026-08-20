import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../../helper/cutomError";
import type { GetBranchesService } from "./get_branches.service";

export class GetBranchesController {
    constructor(private service:GetBranchesService){}
    getBranches = async (req:Request, res:Response, next:NextFunction) => {
        const userId = req.user?.id
        if(!userId){
            return next(new CustomError(401, "no authenticated"))
        }

        try {
            const response = await this.service.getBranches(userId)
            return res.status(200).json({message:"got branches", status:true, data:response})
        } catch (error) {
            next(error)
        }
    }
}