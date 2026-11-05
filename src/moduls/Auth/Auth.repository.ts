import { myDb } from "../../helper/pool"
import type { DBResponse } from "./Auth.schema"

export const AuthRepository = async (userId:number) => {
    const [result] = await myDb.query<DBResponse[]>(`
        select 
            u.role, 
            u.name as user_name,
            b.name as branch_name
        from users u
        left join employees e on e.user_id = u.id
        left join branches b on b.id = e.branch_id

        where u.id=?
    `, [userId])

    return result[0]
}