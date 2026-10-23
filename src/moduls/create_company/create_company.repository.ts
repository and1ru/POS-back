import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

export const CreateCompanyRepository = async (companyName:string, date:string, userName:string, email:string, password:string ) => {
    await myDb.query(`
      start transaction;
      insert into companies (name, date) values (?,?);
      
      set @company_id = last_insert_id();

      insert into users (name, email, password, role, company_id) values (?,?,?,?, @company_id);
      commit;
    `, [companyName, date, userName, email, password, "owner" ])
}

interface findUserByEmailResult extends RowDataPacket {
    email: string
}

export const findUserByEmail = async (email:string) => {
    const [user] = await myDb.query<findUserByEmailResult[]>("SELECT email from users where email=?",[email])
    return user[0]
}