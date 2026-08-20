import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface UsersResponse extends RowDataPacket {
    email:string
}

interface CompanyResponse extends RowDataPacket {
    company_id:number;
}

export const getBranchesRepository = async (userId:number) => {
    const [users] = await myDb.query<UsersResponse[]>("SELECT email FROM users WHERE user_id=?", [userId])
    const user = users[0]
    const [companies] = await myDb.query<CompanyResponse[]>("SELECT company_id FROM company where company_email=?", [user?.email])
    const company = companies[0]
    const [branches] = await myDb.query("SELECT * FROM branches where company_id=?", [company?.company_id]) 
    return branches
}