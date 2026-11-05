import { getBranchesRepository } from "./get_branches.repository"

export class GetBranchesService {
    getBranches = async (companyId:number) => {
        return await getBranchesRepository(companyId)
    }
}