import { myDb } from "../../helper/pool"
import type { Result } from "./statistics_employee.schema"

export const statisticsEmployeeRepositoryOwner = async (groupDate:string, companyId:number, branchId:string, start:string, end:string, name:string) => {    
    const [result] = await myDb.query<Result[]>(
        `select 
	        u.id,
            u.name as user_name,
            b.name as branch_name,
            SUM(s.total_price) as total,
            ${groupDate} as date
        from employees e
        inner join users u on u.id = e.user_id
        inner join sales s on s.user_id = u.id
        inner join branches b on e.branch_id = b.id

        where 
	        u.company_id = ?
            AND e.branch_id like ?
            AND s.date between ? AND ?
            AND u.name like ?
        GROUP BY u.id, u.name, b.name, ${groupDate}
        ORDER BY ${groupDate}
        `,[companyId, branchId, start, end, name])

    return result
}

export const statisticsEmployeeRepositoryAdmin = async (groupDate:string, companyId:number, userId:number, start:string, end:string, name:string) => {
    const [result] = await myDb.query<Result[]>(
        `select 
	        u.id,
            u.name as user_name,
            b.name as branch_name,
            SUM(s.total_price) as total,
            ${groupDate} as date
        from employees e
        inner join users u on u.id = e.user_id
        inner join sales s on s.user_id = u.id
        inner join branches b on e.branch_id = b.id

        where 
	        u.company_id = ?
            AND e.branch_id = (select branch_id from employees where user_id = ?)
            AND s.date between ? AND ?
            AND u.name like ?
            
        GROUP BY u.id, u.name, b.name, ${groupDate}
        `,[companyId, userId, start, end, name])

    return result
}