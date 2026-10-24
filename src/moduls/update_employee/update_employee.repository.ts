import { myDb } from "../../helper/pool"

export const updateEmployeeOwner = async (id:number, branch:number, name:string, role:string, salary:number) => {
    await myDb.query(`
    start transaction;
    update users set 
    name = ?,
    role = ?
    where id = ?;

    update employees set
    salary = ?,
    branch_id = ?
    where user_id = ?;
    commit;
    `,[name, role, id, salary, branch, id])
}