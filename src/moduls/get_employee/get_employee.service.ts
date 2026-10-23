import { CustomError } from "../../helper/cutomError"
import { getEmployeeOwner } from "./get_employee.repository"

export class GetEmployeeService {
    employee = async (employeeId:number, companyId:number, role:string) => {
        if(role === "owner"){
            const result = await getEmployeeOwner(employeeId, companyId)
            if(!result){
                throw new CustomError(404, "user not found")
            }
            
            return result
        }
    }
}