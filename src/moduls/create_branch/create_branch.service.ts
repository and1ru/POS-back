import { createBranchRepository } from "./create_branch.repository"

export class CreateBranchService{
    createBranch = async (address:string, city:string, name:string, userId:number) => {
        await createBranchRepository(address, city, name, userId)
    }
}