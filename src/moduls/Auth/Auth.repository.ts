import type { RowDataPacket } from "mysql2";
import { myDb } from "../../helper/pool"

interface response extends RowDataPacket {
    name:string;
    role:string
}

export const AuthRepository = async (userId:number) => {
    const [row] = await myDb.query<response[]>("select role, name from users where id=?", [userId])
    return row[0]
}