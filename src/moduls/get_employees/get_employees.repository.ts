import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface EmployeeResponse extends RowDataPacket {
    id: number;
    user_id: number;
    branch_id: number;
}

export const employeesAdmin = async (userId: number) => {

    const [employees] = await myDb.query<EmployeeResponse[]>(`
        SELECT 
            e.id,
            e.user_id,
            e.branch_id
        FROM employee e
        INNER JOIN users u
            ON u.id = e.user_id
        WHERE e.branch_id = (
            SELECT branch_id
            FROM employee
            WHERE user_id = ?
        )
        AND u.role = 'cashier'
    `, [userId]);

    return employees;
};

interface ResultUser extends RowDataPacket {
    name: string;
    role: string;
    id: number;
    branch_name:string
}

export const employeesOwner = async (companyId: number) => {
    const [result] = await myDb.query<ResultUser[]>(`
        select 
            users.id,
	        users.name, 
            users.role, 
            branches.name as branch_name
            from users
            inner join employee on users.id = employee.user_id
            inner join branches on employee.branch_id = branches.id

            where users.company_id = ?
        `, [companyId])
    return result
}