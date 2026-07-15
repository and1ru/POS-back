import { pool } from "../helper/pool"

export const loginRepository = async (email:string) => {
    const [row] = await pool.query("", [email])
    return row
}