import type { RowDataPacket } from "mysql2";
import { myDb } from "../helper/pool"

interface response extends RowDataPacket {
    user_id:number;
    user_name:string;
    email:string;
    password:string;
    role:string
}

export const loginRepository = async (email:string):Promise<response | undefined> => {
    const [row] = await myDb.query<response[]>("select * from users where email=?", [email])
    return row[0]
}