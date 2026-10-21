import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface EmployeeResult extends RowDataPacket {
    
}

export const getEmployeeOwner = async (employeeId:number, companyId:number) => {
    const [result] = await myDb.query<EmployeeResult[]>(`select * from useres where id=? company_id=?`, [employeeId, companyId])
    return result[0]
}