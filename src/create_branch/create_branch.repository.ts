import type { RowDataPacket } from "mysql2"
import { myDb } from "../helper/pool"

interface userResponse extends RowDataPacket {
    user_id:number
    email:string
}

interface companyResult extends RowDataPacket {
    company_id:number
}

export const createBranchRepository = async (address:string, city:string, name:string, userId:number) => {
    const [users] = await myDb.query<userResponse[]>("SELECT user_id, email FROM users where user_id=?", [userId])
    const user = users[0]
    const [companies] = await myDb.query<companyResult[]>("SELECT company_id FROM company WHERE company_email=?", [user?.email]) 
    const company = companies[0]
    await myDb.query("INSERT INTO branches (company_id, branch_name, branch_city, branch_address) VALUES (?,?,?,?)",[company?.company_id, name, city, address])
}