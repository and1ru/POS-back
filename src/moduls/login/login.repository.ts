import type { RowDataPacket } from "mysql2";
import { myDb } from "../../helper/pool"

interface Response extends RowDataPacket {
    id:number;
    name:string;
    password:string;
    role:string
    company_id:number
}

export const loginRepository = async (email:string) => {
    const [row] = await myDb.query<Response[]>("select * from users where email=?", [email])
    return row[0]
}