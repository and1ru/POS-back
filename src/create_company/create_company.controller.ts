import type { NextFunction, Request, Response } from "express";
import { createCompanySchema } from "./create_company.schema";
import type { CreateCompanyService } from "./create_company.service";

export class CreateCompanyController {
    constructor(private service:CreateCompanyService){}
    createCompany = (req:Request, res:Response, next:NextFunction) => {
        const data = createCompanySchema.safeParse(req.body)
        if(!data.success){
            return next(data.error)
        }

        try {
            
        } catch (error) {
            return next(error)
        }
    }
}