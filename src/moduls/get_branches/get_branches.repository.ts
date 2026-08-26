import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface Response extends RowDataPacket{
    name:string;
    id:number;
    city:string;
}

export const getBranchesRepository = async (companyId:number) => {
    // 1. get branches with the same companyId
    const [branches] = await myDb.query<Response[]>("select name, id, city from branches where company_id=?",[companyId])
    return branches
}