import type { QueryResult, RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface User extends RowDataPacket{
    employee_id:number;
    employee_name:string;    
}

interface CompanyResponse extends RowDataPacket{
    company_id:number;
}

export const CreateCompanyRepository = async (companyName:string, ownerName:string, email:string, password:string ) => {
    // crea una company sin dueño
    await myDb.query("INSERT INTO company (company_name, owner_id, company_email) VALUES (?,?,?)",[companyName, null, email])
    // crea un employee con el role de owner
    await myDb.query("INSERT INTO employees (employee_name, password, employee_role, email) VALUES (?,?,?,?)", [ownerName, password, "owner", email])
    // obtiene el employee recien creado
    const [users] = await myDb.query<User[]>("SELECT employee_id FROM employees where email=?",[email])
    const user = users[0]
    // actualiza el company y dice quien es el dueño
    await myDb.query("UPDATE company SET owner_id=? where company_email=?",[user?.employee_id, email])
    // en employee poner el companyId
    const [companies] = await myDb.query<CompanyResponse[]>("SELECT company_id FROM company WHERE company_email=?",[email])
    const company = companies[0]
    await myDb.query("UPDATE employees SET company_id=? where email=?",[company?.company_id, email])
    // crea un usuario con los datos
    await myDb.query("INSERT INTO users (user_name,email,password,role) VALUES (?,?,?,?)",[ownerName,email,password, "owner"])
}

export const findEmail = async (email:string) => {
}