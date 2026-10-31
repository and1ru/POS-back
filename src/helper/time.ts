import { DateTime } from "luxon"
import { CustomError } from "./cutomError";

const TIME_ZONE = "America/Bogota";

export const timeHelper = (time:string) => {
    let now = DateTime.now().setZone(TIME_ZONE)
    let start: DateTime = now
    let end: DateTime = now
    let groupDate = ""

    switch (time) {
        case "all":
            groupDate = `date_format(s.date, "%y")`
            start = DateTime.fromObject({ year: 2000, month: 1, day: 1 })
            end = now
            break;

        case "year":
            groupDate = `date_format(s.date, "%y-%m")`
            start = now.startOf("year")
            end = now
            break;

        case "month":
            groupDate = `floor((day(s.date) -1) / 3)`
            start = now.startOf("month")
            end = now
            break;

        case "week":
            groupDate = `date_format(s.date, "%y-%m-%d")`
            start = now.startOf("week")
            end = now
            break;

        default:
            throw new CustomError(400, "value not valid");
    }

    let dateStart: Date | string = start.toUTC().toJSDate()
    let dateEnd: Date | string = end.toUTC().toJSDate()

    dateStart = `${dateStart.getFullYear()}-${dateStart.getMonth() + 1}-${dateStart.getDate()}`

    dateEnd = `${dateEnd.getFullYear()}-${dateEnd.getMonth() + 1}-${dateEnd.getDate()}`

    return { groupDate, dateStart, dateEnd}
}