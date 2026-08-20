import { getBranchesRepository } from "./get_branches.repository"

export class GetBranchesService {
    getBranches = async (userId:number) => {
        const response = await getBranchesRepository(userId)
        return response
    }
}