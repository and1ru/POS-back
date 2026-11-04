import type { RowDataPacket } from "mysql2";
import { myDb } from "../../helper/pool"

interface response extends RowDataPacket {
    user_name:string;
    role:string
    branch_name:string
}

export const AuthRepository = async (userId:number) => {
    const [result] = await myDb.query<response[]>(`
        select 
            u.role, 
            u.name as user_name,
            b.name as branch_name
        from users u
        inner join employees e on e.user_id = u.id
        inner join branches b on b.id = e.branch_id

        where u.id=?
        
    `, [userId])
    return result[0]
}