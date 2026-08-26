import { getBranchesRepository } from "./get_branches.repository"

export class GetBranchesService {
    getBranches = async (companyId:number) => {
        // verify company exist
        const response = await getBranchesRepository(companyId)
        return response
    }
}