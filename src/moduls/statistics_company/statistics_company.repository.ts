import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface Result extends RowDataPacket {
    total: number;
    date: string;
}

export const statisticsCompanyRepository = async (groupDate:string, companyId:number, start:string, end:string) => {
    const [result] = await myDb.query<Result[]>(`
        select 
	        SUM(s.total_price) as total,
            ${groupDate} as date
        from sales s
        inner join branches b on b.id = s.branch_id 

        where 
            b.company_id = ?
            AND s.date between ? AND ?

        group by ${groupDate}
        order by ${groupDate}
    `, [companyId, start, end])

    return result
}