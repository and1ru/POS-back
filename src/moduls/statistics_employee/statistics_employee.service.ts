import { timeHelper } from "../../helper/time"
import { statisticsEmployeeRepositoryAdmin, statisticsEmployeeRepositoryOwner } from "./statistics_employee.repository"
import type { Result } from "./statistics_employee.schema"

export class StatisticsEmployeeService {
    statisticsEmployee = async (role: string, time: string, companyId: number, userId: number, name?: string, branchId?: string) => {
        const finalBranchId = `${branchId ?? "%%"}`
        const finalName = name === undefined ? "%%" : `%${name}%`
        let dbResult: Result[] = []

        const { dateEnd, dateStart, groupDate } = timeHelper(time)

        if (role === "owner") {
            dbResult = await statisticsEmployeeRepositoryOwner(groupDate, companyId, finalBranchId, dateStart, dateEnd, finalName)
        }

        if (role === "admin") {
            dbResult = await statisticsEmployeeRepositoryAdmin(groupDate, companyId, userId, dateStart, dateEnd, finalName)
        }

        const chartData:Record<string, string | number>[] = []
        const keys = new Set<string>()

        for (const employee of dbResult) {
            const key = `#${employee.id} ${employee.user_name}`
            const lastRow = chartData[chartData.length - 1]

            keys.add(key)

            if(!lastRow || lastRow.date !== employee.date){
                chartData.push({ date: employee.date, [key]:employee.total })
            } else {
                lastRow[key] = employee.total
            }
        }
        
        return { chartData, keys: [...keys] }
    }
}