import type { NextFunction, Request, Response } from "express";
import { companySchema } from "./create_company.schema";
import type { CreateCompanyService } from "./create_company.service";

export class CreateCompanyController {
    constructor(private service:CreateCompanyService){}
    createCompany = async (req:Request, res:Response, next:NextFunction) => {
        const data = companySchema.safeParse(req.body)
        if(!data.success){
            return next(data.error)
        }

        try {
            const { companyName, ownerName, email, password } = data.data
            await this.service.createCompany(companyName, ownerName, email, password)
            return res.status(201).json({message:"company created", success:true})
        } catch (error) {
            return next(error)
        }
    }
}