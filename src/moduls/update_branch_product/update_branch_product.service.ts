import { CustomError } from "../../helper/cutomError"
import { findBranchProductById, updatedBranchProduct } from "./update_branch_product.repository"

export class UpdateBranchProductService {
    updateBranchProduct = async (boughtPriceProduct:number, currentStock:number, minStock:number, productId:number, sellPriceProduct:number, userId:number) => {
        const product = await findBranchProductById(productId, userId)
        if(!product){
            throw new CustomError(404, "no product branch")
        }

        await updatedBranchProduct(boughtPriceProduct, currentStock, minStock, productId, sellPriceProduct, userId)
    }
}