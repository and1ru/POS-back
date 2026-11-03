import { timeHelper } from "../../helper/time"
import { statisticsBranchAdmin, statisticsBranchOwner } from "./statistics_branch.repository"
import type { statisticsBranchResponse } from "./statistics_branch.schema"

export class StatisticsBranchService {
    statisticsBranch = async (userId:number, role:string, time:string, companyId:number, branchId?:string) => {
        const finalBranchId = `${ branchId ?? "%%"}`

        const { dateEnd, dateStart, groupDate } = timeHelper(time)

        let dbResult:statisticsBranchResponse[] = []

        if(role === "owner"){
            dbResult = await statisticsBranchOwner(groupDate, companyId, finalBranchId, dateStart, dateEnd)
        }

        if(role === "admin"){
            dbResult = await statisticsBranchAdmin(groupDate, companyId, userId, dateStart, dateEnd)
        }

        const keys = new Set()
        const chartData:Record<string, string | number>[] = []

        for (const branch of dbResult) {
            const key = `#${branch.id} ${branch.name}`
            const lastRow = chartData[chartData.length - 1]

            keys.add(key)

            if(!lastRow || lastRow.date !== branch.date){
                chartData.push({date:branch.date, [key]: branch.total})
            } else {
                lastRow[key] = branch.total
            }
        }

        return { chartData, keys: [...keys]}
    }
}