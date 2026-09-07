import type { ResultSetHeader, RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface CreateCompany extends ResultSetHeader {
    insertId:number;
}


export const CreateCompanyRepository = async (companyName:string, userName:string, email:string, password:string ) => {
    // 1. create company
    const [createCompany] = await myDb.query<CreateCompany>("INSERT INTO company (name) VALUES (?)",[companyName])
    // 2. create an user
    await myDb.query("INSERT INTO users (name, email, password, role, company_id) VALUES (?,?,?,?,?)", [userName, email, password, "owner", createCompany.insertId])
}

export const findUser = async (email:string) => {
    const [user] = await myDb.query("SELECT email from users where email=?",[email])
    return user
}