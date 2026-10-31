import { timeHelper } from "../../helper/time"
import { statisticsEmployeeRepositoryAdmin, statisticsEmployeeRepositoryOwner } from "./statistics_employee.repository"

export class StatisticsEmployeeService {
    statisticsEmployee = async (role:string, time:string, companyId:number, userId:number, name?:string, branchId?:string) => {
        const finalBranchId = `${ branchId ?? "%%"}`
        const finalName = name === undefined ? "%%" : `%${name}%`

        const { dateEnd, dateStart, groupDate } = timeHelper(time)

        if(role === "owner"){
            return await statisticsEmployeeRepositoryOwner(groupDate, companyId, finalBranchId, dateStart, dateEnd, finalName)
        }

        if(role === "admin"){
            return await statisticsEmployeeRepositoryAdmin(groupDate, companyId, userId, dateStart, dateEnd, finalName)
        }
    }
}