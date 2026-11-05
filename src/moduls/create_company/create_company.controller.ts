import type { NextFunction, Request, Response } from "express";
import type { CreateCompanyService } from "./create_company.service";

export class CreateCompanyController {
    constructor(private service: CreateCompanyService) { }
    createCompany = async (req: Request, res: Response, next: NextFunction) => {
        const { companyName, ownerName, email, password } = req.body

        try {
            await this.service.createCompany(companyName, ownerName, email, password)
            return res.status(201).json({ message: "company created", success: true })
        } catch (error) {
            return next(error)
        }
    }
}