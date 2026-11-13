import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface findUserByEmailResult extends RowDataPacket {
    email: string
}

export const findUserByEmail = async (email:string) => {
    const [user] = await myDb.query<findUserByEmailResult[]>("SELECT email from users where email=?",[email])
    return user[0]
}