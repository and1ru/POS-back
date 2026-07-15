import { pool } from "../helper/pool"

interface User {
    name:string;
    email:string;
    password:string
}

export const registerRepository = async (user:User) => {
    const [row] = await pool.query("",[])
}

export const findUser = async (email:string) => {
    const [row] = await pool.query("", [])

    return row
}