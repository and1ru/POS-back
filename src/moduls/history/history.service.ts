import { timeHelper } from "../../helper/time";
import { historyAdmin, historyCashier, historyOwner } from "./history.repository"

export class HistoryService {
    history = async (userId: number, role: string, saleDate: string, saleId?: string) => {
        let finalSaleId = `%${saleId ?? ""}%`

        const { dateEnd, dateStart } = timeHelper(saleDate)

        if (role === "cashier") {
            return await historyCashier(userId, finalSaleId, dateStart, dateEnd)
        }

        if (role === "admin"){
            return await historyAdmin(userId, finalSaleId, dateStart, dateEnd)
        }

        if (role === "owner"){
            return await historyOwner(userId, finalSaleId, dateStart, dateEnd)
        }
    }
}