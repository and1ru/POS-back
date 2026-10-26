import { CustomError } from "../../helper/cutomError"
import { findBranchProductById, updatedBranchProduct } from "./update_branch_product.repository"

export class UpdateProductService {
    updateProduct = async (boughtPriceProduct:number, currentStock:number, minStock:number, productId:number, sellPriceProduct:number, userId:number) => {
        // verificar si el product existe
        const product = await findBranchProductById(productId)
        if(product.length === 0){
            throw new CustomError(404, "no product branch")
        }

        await updatedBranchProduct(boughtPriceProduct, currentStock, minStock, productId, sellPriceProduct, userId)
    }
}