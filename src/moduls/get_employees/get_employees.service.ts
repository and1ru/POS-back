import { employeesOwner, employeesAdmin } from "./get_employees.repository";

export class EmployeesService {
    employee = async (userRole:string, userId:number, companyId:number, employeeName:string | undefined, employeeRole:string | undefined, employeeBranch:string | undefined ) => {
        let finalEmployeeName:string = "%%"
        let finalEmployeeRole:string = "%%"
        let finalEmployeeBranch:string = "%%"

        if(employeeName !== undefined){
            finalEmployeeName = `%${employeeName}%`
        }

        if(employeeBranch !== undefined){
            finalEmployeeBranch = `%${employeeBranch}%`
        }

        if(employeeRole !== undefined){
            finalEmployeeRole = `%${employeeRole}%`
        }


        if(userRole === "admin"){
            return await employeesAdmin(userId)
        }
        if(userRole === "owner"){
            return await employeesOwner(companyId, finalEmployeeName, finalEmployeeRole, finalEmployeeBranch)
        }
    }
}