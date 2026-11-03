import { timeHelper } from "../../helper/time"
import { statisticsCompanyRepository } from "./statistics_company.repository"

export class StatisticsCompanyService {
    statisticsCompany = async (time: string, companyId: number) => {
        const { dateEnd, dateStart, groupDate } = timeHelper(time)
        return await statisticsCompanyRepository(groupDate, companyId, dateStart, dateEnd)
    }
}