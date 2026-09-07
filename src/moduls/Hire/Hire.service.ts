import { CustomError } from "../../helper/cutomError"
import { hashPassword } from "../../helper/hashPassword"
import { findUser, hireRepository } from "./Hire.repository"

export class HireSerivce {
    hire = async (name: string, email: string, password: string, role: string, companyId: number, branchId: number) => {
        // verificar que exista la empresa
        // verificar que exista la branch
        // verificar que no exista un usuario con el mismo email
        const user = await findUser(email)
        if (user) {
            throw new CustomError(400, "credentials error")
        }
        // hire

        const hashedPassword = await hashPassword(password)
        await hireRepository(name, email, hashedPassword, role, companyId, branchId)
    }
}