import { CustomError } from "../../helper/cutomError"
import { createProductBranch, findBranchId, findBranchProduct } from "./create_branch_product.repository"

export class CreateProductService {
    createProduct = async (boughtPriceProduct:number, currentStock:number, minStock:number, sellPriceProduct:number, productId:number, userId:number) => {
        const branchId = await findBranchId(userId)
        if (!branchId) {
            throw new CustomError(404, "branch no found")
        }

        const product = await findBranchProduct(productId, userId)
        if (product!.length > 0 ) {
            throw new CustomError(400, "product already exist")
        }

        await createProductBranch(minStock, currentStock, boughtPriceProduct, sellPriceProduct, userId, productId)
    }
}