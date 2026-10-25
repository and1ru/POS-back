import { CustomError } from "../../helper/cutomError"
import { hashPassword } from "../../helper/hashPassword"
import { findUserByEmail } from "../create_company/create_company.repository"
import { hireByAdmin, hireByOwner } from "./Hire.repository"

export class HireSerivce {
    hire = async (name: string, email: string, password: string, role: string, companyId: number, branchId: number, salary:number, userRole:string, userId:number) => {
        // verificar que exista la empresa
        // verificar que exista la branch
        // verificar que no exista un usuario con el mismo email
        const user = await findUserByEmail(email)
        if (user) {
            throw new CustomError(400, "credentials error")
        }
        
        // hire
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