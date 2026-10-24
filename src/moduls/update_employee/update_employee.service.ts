import { updateEmployeeOwner } from "./update_employee.repository"

export class UpdateEmployeeService {
    employee = async (id:number, branch:number, name:string, role:string, salary:number) => {
        // verificar que el employee sea de la company
        // el admin solo puede cambiar ciertas cosas
        // 
        console.log("service")
        await updateEmployeeOwner(id, branch, name, role, salary)
    }
}