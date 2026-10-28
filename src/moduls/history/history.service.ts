import { CustomError } from "../../helper/cutomError";
import { historyAdmin, historyCashier, historyOwner } from "./history.repository"
import { DateTime } from "luxon"

const TIME_ZONE = "America/Bogota";

export class HistoryService {
    history = async (userId: number, role: string, saleId: string | undefined, saleDate: string | undefined) => {
        let finalSaleId = `%${saleId ?? ""}%`

        const now = DateTime.now().setZone(TIME_ZONE)
        let startDate: DateTime
        let endDate: DateTime

        switch (saleDate) {
            case "today":
                startDate = now.startOf("day")
                endDate = now
                break;

            case "yesterday":
                endDate = now.startOf("day");
                startDate = endDate.minus({ days: 1 });
                break;

            case "week":
                startDate = now.startOf("week");
                endDate = now;
                break;

            case "month":
                startDate = now.startOf("month");
                endDate = now;
                break;

            case "year":
                startDate = now.startOf("year");
                endDate = now;
                break;

            case "":
                startDate = now.startOf("year");
                endDate = now;
                break;

            default:
                throw new CustomError(400, "date error");
        }

        const start = startDate.toUTC().toJSDate()
        const end = endDate.toUTC().toJSDate()

        if (role === "cashier") {
            return await historyCashier(userId, finalSaleId, start, end)
        }

        if (role === "admin"){
            return await historyAdmin(userId, finalSaleId, start, end)
        }

        if (role === "owner"){
            return await historyOwner(userId, finalSaleId, start, end)
        }
    }
}