import type { DbResponse } from "./get_branches.schema"
import { myDb } from "../../helper/pool"

export const getBranchesRepository = async (companyId:number) => {
    const [branches] = await myDb.query<DbResponse[]>("select name, id, city from branches where company_id=?",[companyId])
    return branches
}