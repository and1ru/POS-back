import { employeesOwner, employeesAdmin } from "./get_employees.repository";

export class EmployeesService {
    employee = async (userRole:string, userId:number, companyId:number, employeeName:string | undefined, employeeRole:string | undefined, employeeBranch:string | undefined ) => {
        let finalEmployeeName = employeeName !== undefined ? `%${employeeName}%` : "%"
        let finalEmployeeRole = employeeRole !== undefined ? `%${employeeRole}%` : "%"
        let finalEmployeeBranch = employeeBranch !== undefined ? `${employeeBranch}` : "%"

        if(userRole === "admin"){
            return await employeesAdmin(userId, finalEmployeeName)
        }

        if(userRole === "owner"){
            return await employeesOwner(companyId, finalEmployeeName, finalEmployeeRole, finalEmployeeBranch)
        }
    }
}