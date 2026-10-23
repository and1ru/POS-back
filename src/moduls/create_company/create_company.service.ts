import { CustomError } from "../../helper/cutomError"
import { hashPassword } from "../../helper/hashPassword"
import { CreateCompanyRepository, findUserByEmail } from "./create_company.repository"

export class CreateCompanyService {
    createCompany = async (companyName:string, ownerName:string, email:string, password:string) => {
        const user = await findUserByEmail(email)
        if(user){
            throw new CustomError(400, "credentials error")
        }

        const currentDate = new Date()

        const year =  currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, "0")
        const day = String(currentDate.getDate()).padStart(2, "0")

        const finalDate = `${year}-${month}-${day}`

        const hashedPassword = await hashPassword(password)
        await CreateCompanyRepository(companyName, finalDate, ownerName,email,hashedPassword)
    }
}