import { inventoryRepositoryAdmin, inventoryRepositoryCashier, inventoryRepositoryOwner } from "./inventory.repository"

export class InventoryService {
    intentory = async (role: string, companyId: number, userId: number, productName: string | undefined, price:string | undefined, stock:string | undefined) => {
        let name: string = ""
        if (productName !== undefined) {
            name = productName
        }
        
        if (role === "owner") {
            return await inventoryRepositoryOwner(companyId, `%${name}%`)
        }

        if (role === "admin") {
            let finalStock:string = ""
            let finalPrice:string = ""

            if(stock !== undefined){
                finalStock = stock
            }

            if(price !== undefined){
                finalPrice = price
            }

            const result = await inventoryRepositoryAdmin(userId, `%${name}%`, finalPrice, finalStock)
            return result
        }

        if (role === "cashier") {
            const result = await inventoryRepositoryCashier(userId)
            return result
        }
    }
}