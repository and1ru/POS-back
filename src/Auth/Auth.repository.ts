import type { RowDataPacket } from "mysql2";
import { pool } from "../helper/pool"

interface response extends RowDataPacket {
    user_id:number;
    user_name:string;
    email:string;
    password:string;
    role:string
}

export const AuthRepository = async (userId:number) => {
    const [row] = await pool.query<response[]>("select * from users where user_id=?", [userId])
    return row[0]
}