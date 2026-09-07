import { hashPassword } from "../../helper/hashPassword"
import { hireRepository } from "./Hire.repository"

export class HireSerivce{
    hire = async (name:string, email:string, password:string, role:string, companyId:number, branchId:number) => {
        // verificar que exista la empresa
        // verificar que exista la branch
        // hire
        const hashedPassword = await hashPassword(password)
        await hireRepository(name, email, hashedPassword, role, companyId, branchId)
    }
}