import { timeHelper } from "../../helper/time";
import { statisticsProductsRepositoryAdmin, statisticsProductsRepositoryOwner } from "./statistics_products.repository";


export class StatisticsProductsService {
    statisticsProducts = async ( userId:number, role:string, companyId:number, time:string,  branchId?:string, name?:string ) => {
        const finalBranchId = `${ branchId ?? "%%"}`
        const finalName = `${ name ?? "%%" }`

        const { groupDate, dateEnd, dateStart} = timeHelper(time)

        if(role === "owner"){
            return await statisticsProductsRepositoryOwner(companyId, finalBranchId, finalName, dateStart, dateEnd, groupDate )
        }

        if(role === "admin"){
            return await statisticsProductsRepositoryAdmin(groupDate, companyId, userId, finalName, dateStart, dateEnd)
        }
    }
}