import { timeHelper } from "../../helper/time";
import { statisticsProductsRepositoryAdmin, statisticsProductsRepositoryOwner } from "./statistics_products.repository";
import type { statisticsProductsDB } from "./statistics_products.schema";


export class StatisticsProductsService {
    statisticsProducts = async (userId: number, role: string, companyId: number, time: string, branchId?: string, name?: string) => {
        const finalBranchId = `${branchId ?? "%%"}`
        const finalName = `${name ?? "%%"}`
        let dbResult: statisticsProductsDB[] = []

        const { groupDate, dateEnd, dateStart } = timeHelper(time)

        if (role === "owner") {
            dbResult = await statisticsProductsRepositoryOwner(companyId, finalBranchId, finalName, dateStart, dateEnd, groupDate)
        }

        if (role === "admin") {
            dbResult = await statisticsProductsRepositoryAdmin(groupDate, companyId, userId, finalName, dateStart, dateEnd)
        }

        const chartData: Record<string, string | number>[] = []
        const keys = new Set<string>()

        for (const product of dbResult) {
            const key = `#${product.id} ${product.name}`
            const lastRow = chartData[chartData.length - 1]

            keys.add(key)

            // si no hay filas o la fecha cambió, crea una fila nueva con este producto
            if (!lastRow || lastRow.date !== product.date) {
                chartData.push({ date: product.date, [key]: product.total })
            } else {
                // misma fecha: agrega el producto a la fila actual
                lastRow[key] = product.total
            }
        }

        return { chartData, keys: [...keys]}
    }
}