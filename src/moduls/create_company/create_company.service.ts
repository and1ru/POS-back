import { CustomError } from "../../helper/cutomError"
import { hashPassword } from "../../helper/hashPassword"
import { CreateCompanyRepository, findUser } from "./create_company.repository"

export class CreateCompanyService {
    createCompany = async (companyName:string, ownerName:string, email:string, password:string) => {
        const user = await findUser(email)
        if(user){
            throw new CustomError(400, "credentials error")
        }

        const hashedPassword = await hashPassword(password)
        await CreateCompanyRepository(companyName,ownerName,email,hashedPassword)
    }
}