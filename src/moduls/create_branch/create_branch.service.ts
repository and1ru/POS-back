import { createBranchRepository } from "./create_branch.repository"

export class CreateBranchService{
    createBranch = async (address:string, city:string, name:string, companyId:number) => {
        await createBranchRepository(address, city, name, companyId)
    }
}