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

interface ResultUser extends RowDataPacket{
    name:string;
    role:string;
    id:number;
}

export const employees = async (companyId:number) => {
    const [result] = await myDb.query<ResultUser[]>("SELECT name,role,id FROM users where company_id=? and ( role = 'admin' or role='cashier' )", [companyId])
    return result
}