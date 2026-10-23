import { inventoryRepositoryAdmin, inventoryRepositoryCashier, inventoryRepositoryOwner } from "./inventory.repository"

export class InventoryService {
    intentory = async (role: string, companyId: number, userId: number, productName: string | undefined) => {
        let name: string = ""
        if (productName !== undefined) {
            name = productName
        }
        
        if (role === "owner") {
            return await inventoryRepositoryOwner(companyId, `%${name}%`)
        }
        if (role === "admin") {
            const result = await inventoryRepositoryAdmin(userId)
            return result
        }
        if (role === "cashier") {
            const result = await inventoryRepositoryCashier(userId)
            return result
        }
    }
}