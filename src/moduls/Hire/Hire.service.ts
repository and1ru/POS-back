import { CustomError } from "../../helper/cutomError"
import { hashPassword } from "../../helper/hashPassword"
import { findUserByEmail } from "../create_company/create_company.repository"
import { hireByAdmin, hireByOwner } from "./Hire.repository"

// validar que la branch pertenezca a la company

export class HireSerivce {
    hire = async (name: string, email: string, password: string, role: string, companyId: number, branchId: number, salary:number, userRole:string, userId:number) => {
        if(userRole === "admin" && role === "admin"){
            throw new CustomError(403, "admin can not hire an admin")
        }
        
        const user = await findUserByEmail(email)
        if (user) {
            throw new CustomError(400, "credentials error")
        }
        
        const hashedPassword = await hashPassword(password)
        const date = new Date()
        const finalDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

        if(userRole === "owner"){
            await hireByOwner(name, email, hashedPassword, role, companyId, branchId, salary, finalDate)
        }

        if(userRole === "admin"){
            await hireByAdmin(name, email, hashedPassword, companyId, userId, finalDate, salary)
        }
        
    }
}