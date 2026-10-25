import type { ResultSetHeader } from "mysql2"
import { myDb } from "../../helper/pool"

interface UserResponse extends ResultSetHeader {
    insertId:number
}

export const hireByOwner = async (name:string, email:string, password:string, role:string, companyId:number, branchId:number, salary:number, date:string) => {
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

export const hireByAdmin = async (name:string, email:string, password:string, companyId:number, userId:number, date:string, salary:number) => {
    await myDb.query(`
        start transaction;

        -- crear el usuario
        insert into users (name, email, password, role, company_id)
        values (?, ?, ?, ?, ?);

        -- obtener el id del registro de user
        set @user_id = last_insert_id();
		set @branch_id = (select branch_id from employees where user_id = ?);
        
        -- registrar el employee
        insert into employees (user_id, branch_id, date, salary)
        values (@user_id, @branch_id, ?, ?);

        -- confirmar operacion
        COMMIT;
    `, [name, email, password, "cashier", companyId, userId, date, salary])
}