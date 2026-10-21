import { getEmployeeOwner } from "./get_employee.repository"

export class GetEmployeeService {
    employee = async (employeeId:number, companyId:number, role:string) => {
        if(role === "owner"){
            const result = await getEmployeeOwner(employeeId, companyId)
            return result
        }
    }
}