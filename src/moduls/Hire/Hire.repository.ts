import type { ResultSetHeader } from "mysql2"
import { myDb } from "../../helper/pool"

interface UserResponse extends ResultSetHeader {
    insertId:number
}

export const hireRepository = async (name:string, email:string, password:string, role:string, companyId:number, branchId:number, salary:number, date:Date) => {
    await myDb.query(`
        start transaction;

        -- crear el usuario
        insert into users (name, email, password, role, company_id)
        values (?, ?, ?, ?, ?);

        -- obtener el id del registro de user
        set @user_id = last_insert_id();

        -- registrar el employee
        insert into employees (user_id, branch_id, date, salary)
        values (@user_id, ? ,?, ?);

        -- confirmar operacion
        COMMIT;
        `, [name, email, password, role, companyId, branchId, date, salary])
}