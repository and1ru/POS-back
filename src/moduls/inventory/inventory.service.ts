import { inventoryRepositoryAdmin, inventoryRepositoryCashier, inventoryRepositoryOwner } from "./inventory.repository"

export class InventoryService{
    intentory = async (role:string, companyId:number, userId:number) => {
        if(role === "owner"){
            return await inventoryRepositoryOwner(companyId)
        }
        if(role === "admin"){
            const result = await inventoryRepositoryAdmin(userId)
            console.log(result)
            return result
        }
        if(role === "cashier"){
            const result = await inventoryRepositoryCashier(userId)
            return result
        }
    }
}