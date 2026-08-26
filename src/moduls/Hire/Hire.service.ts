import { hireRepository } from "./Hire.repository"

export class HireSerivce{
    hire = async (name:string, email:string, password:string, role:string, companyId:number, branchId:number) => {
        // verificar que exista la empresa
        // verificar que exista la branch
        // hire
        await hireRepository(name, email, password, role, companyId, branchId)
    }
}