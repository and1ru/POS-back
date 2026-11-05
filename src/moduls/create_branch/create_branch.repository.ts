import { myDb } from "../../helper/pool"

export const createBranchRepository = async (address:string, city:string, name:string, companyId:number) => {
    await myDb.query(`
        INSERT INTO 
        branches (name, address, city, company_id) 
        VALUES (?,?,?,?)
        `,[name, address, city, companyId])
}