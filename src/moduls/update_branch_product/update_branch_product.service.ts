import { CustomError } from "../../helper/cutomError"
import { findProduct, updatedProduct } from "./update_branch_product.repository"

export class UpdateProductService {
    updateProduct = async (price:number, productId:number, stock:number) => {
        // verificar si el product existe
        const product = await findProduct(productId)
        if(!product){
            throw new CustomError(404, "no product branch")
        }

        await updatedProduct(product[0]!.id, stock, price)
        return
    }
}