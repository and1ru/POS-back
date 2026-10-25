import { CustomError } from "../../helper/cutomError"
import { createProductBranch, findBranchId, findBranchProduct } from "./create_branch_product.repository"

export class CreateProductService {
    createProduct = async (boughtPriceProduct:number, currentStock:number, minStock:number, sellPriceProduct:number, productId:number, userId:number) => {
        // buscar la branch
        const branchId = await findBranchId(userId)
        // si la branch no existe error
        if (!branchId) {
            throw new CustomError(404, "branch no found")
        }

        // verificar si el product existe
        const product = await findBranchProduct(productId, userId)
        // si el producto existe error
        if (product.length > 0) {
            throw new CustomError(400, "product already exist")
        }

        await createProductBranch(minStock, currentStock, boughtPriceProduct, sellPriceProduct, userId, productId)
    }
}