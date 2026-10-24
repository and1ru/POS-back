import { CustomError } from "../../helper/cutomError"
import { getEmployeeAdmin, getEmployeeOwner } from "./get_employee.repository"

export class GetEmployeeService {
    employee = async (employeeId:number, companyId:number, role:string, userId:number) => {
        if(role === "owner"){
            const result = await getEmployeeOwner(employeeId, companyId)
            if(!result){
                throw new CustomError(404, "user not found")
            }

            return result
        }

        if(role === "admin"){
            const result = await getEmployeeAdmin(employeeId, userId)
            if(!result){
                throw new CustomError(404, "user not found")
            }

            return result
        }
    }
}