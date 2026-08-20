import { hashPassword } from "../../helper/hashPassword"
import { CreateCompanyRepository } from "./create_company.repository"

export class CreateCompanyService {
    createCompany = async (companyName:string, ownerName:string, email:string, password:string) => {
        const hashedPassword = await hashPassword(password)
        await CreateCompanyRepository(companyName,ownerName,email,hashedPassword)
    }
}