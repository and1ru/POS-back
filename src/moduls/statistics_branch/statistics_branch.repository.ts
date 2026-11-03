import type { RowDataPacket } from "mysql2";
import { myDb } from "../../helper/pool"
import type { statisticsBranchResponse } from "./statistics_branch.schema";



export const statisticsBranchOwner = async (groupDate:string, companyId:number, branchId:string, start:string, end:string) => {
    const [result] = await myDb.query<statisticsBranchResponse[]>(`
        select 
	        b.id,
	        b.name,
            SUM(s.total_price) as total,
            ${groupDate} as date
        from branches b
        inner join sales s on b.id = s.branch_id

        where 
	        company_id = ? 
            AND b.id like ?
            AND s.date between ? AND ?

        group by b.name, b.id, ${groupDate}

        order by ${groupDate} ASC
    `,[companyId, branchId, start, end])

    return result
}

export const statisticsBranchAdmin = async (groupDate:string, companyId:number, userId:number, start:string, end:string) => {
    const [result] = await myDb.query<statisticsBranchResponse[]>(`
        select 
	        b.id,
	        b.name,
            SUM(s.total_price) as total,
            ${groupDate} as date
        from branches b
        inner join sales s on b.id = s.branch_id

        where 
	        company_id = ? 
            AND b.id = (select branch_id from employees where user_id = ?)
            AND s.date between ? AND ?

        group by b.name, b.id, ${groupDate}

        order by ${groupDate} ASC
    `,[companyId, userId, start, end])

    return result
}