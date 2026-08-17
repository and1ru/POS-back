import type { QueryResult, RowDataPacket } from "mysql2"
import { myDb } from "../helper/pool"

interface User extends RowDataPacket{
    employee_id:number;
    employee_name:string;    
}

export const CreateCompanyRepository = async (companyName:string, ownerName:string, email:string, password:string ) => {
    await myDb.query("INSERT INTO company (company_name, owner_id, company_email) VALUES (?,?,?)",[companyName, null, email])
    await myDb.query("INSERT INTO employees (employee_name, password, employee_role, email) VALUES (?,?,?,?)", [ownerName, password, "owner", email])
    const [users] = await myDb.query<User[]>("SELECT employee_id FROM employees where email=?",[email])
    const user = users[0]
    await myDb.query("UPDATE company SET owner_id=? where company_email=?",[user?.employee_id, email])

    await myDb.query("INSERT INTO users (user_name,email,password,role) VALUES (?,?,?,?)",[ownerName,email,password, "owner"])
}

export const findEmail = async (email:string) => {
}