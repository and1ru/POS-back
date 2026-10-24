import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface EmployeeResponse extends RowDataPacket {
    id: number;
    user_id: number;
    branch_id: number;
}

export const employeesAdmin = async (userId: number, name:string) => {

    const [employees] = await myDb.query<EmployeeResponse[]>(`
        SELECT 
	        users.name,
	        users.id,
            users.role,
            branches.name as branch_name
            FROM users
            INNER JOIN employees ON users.id = employees.user_id
            INNER JOIN branches on branches.id = employees.branch_id
		    WHERE users.role = 'cashier'
            AND employees.branch_id = (
			    select branch_id
                from employees where user_id = ?
            )
            AND users.name like ?
    `, [userId, name]);

    return employees;
};

interface ResultUser extends RowDataPacket {
    name: string;
    role: string;
    id: number;
    branch_name:string
}

export const employeesOwner = async (companyId: number, employeeName:string, employeeRole:string, employeeBranch:string) => {
    const [result] = await myDb.query<ResultUser[]>(`
        select 
            users.id,
	        users.name, 
            users.role, 
            branches.name as branch_name
            from users
            inner join employees on users.id = employees.user_id
            inner join branches on employees.branch_id = branches.id

            where users.company_id = ? AND
            users.name like ? AND
            users.role like ? AND
            employees.branch_id like ?
        `, [companyId, employeeName, employeeRole, employeeBranch])
    return result
}