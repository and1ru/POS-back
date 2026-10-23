import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface EmployeeResult extends RowDataPacket {
    name:string
    role:string
    salary:number
    branch_name:string
    date: Date
}

export const getEmployeeOwner = async (employeeId:number, companyId:number) => {
    const [result] = await myDb.query<EmployeeResult[]>(`
        select 
            users.name,
            users.role,
            employees.date,
            employees.salary,
            branches.name as branch_name
            from users
            inner join employees on employees.user_id = users.id
            inner join branches on branches.id = employees.branch_id
            where users.id=? and users.company_id = ?`, [employeeId, companyId])
    return result[0]
}