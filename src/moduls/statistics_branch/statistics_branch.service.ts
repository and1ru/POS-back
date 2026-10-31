import { timeHelper } from "../../helper/time"
import { statisticsBranchAdmin, statisticsBranchOwner } from "./statistics_branch.repository"

export class StatisticsBranchService {
    statisticsBranch = async (userId:number, role:string, time:string, companyId:number, branchId?:string) => {
        const finalBranchId = `${ branchId ?? "%%"}`

        const { dateEnd, dateStart, groupDate } = timeHelper(time)

        if(role === "owner"){
            return await statisticsBranchOwner(groupDate, companyId, finalBranchId, dateStart, dateEnd)
        }

        if(role === "admin"){
            return await statisticsBranchAdmin(groupDate, companyId, userId, dateStart, dateEnd)
        }
    }
}