// if role is admin just get employees from his branch, will just get employees with cashier role
// if role is owner get all employees
// it will be able to filter by role and branch (just for owner)
// if an adnmin tries to filter by role o branch return an error

import { employees, employeesAdmin } from "./get_employees.repository";

export class EmployeesService {
    employee = async (userRole:string, userId:number, companyId:number) => {
        let result;
        if(userRole === "admin"){
            result = await employeesAdmin(userId)
            console.log(result)
        }
        if(userRole === "owner"){
            result = await employees(companyId)
            console.log(result)
        }
        return result
    }
}