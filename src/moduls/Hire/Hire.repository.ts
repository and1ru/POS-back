import type { ResultSetHeader } from "mysql2"
import { myDb } from "../../helper/pool"

interface UserResponse extends ResultSetHeader {
    insertId:number
}

export const hireRepository = async (name:string, email:string, password:string, role:string, companyId:number, branchId:number) => {
    const [user] = await myDb.query<UserResponse>("INSERT INTO users (name, email, password, role, company_id) values(?,?,?,?,?) ",[name, email, password, role, companyId])
    await myDb.query("INSERT INTO employee (branch_id, user_id) values (?,?)",[branchId, user.insertId])
}