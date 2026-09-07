import { CustomError } from "../../helper/cutomError"
import { createProductBranch, findBranchId, findProduct } from "./create_branch_product.repository"

export class CreateProductService {
    createProduct = async (price: number, productId: number, stock: number, userId: number) => {
        console.log("entro al service")
        // buscar la branch
        const branchId = await findBranchId(userId)
        // si la branch no existe error
        if (!branchId) {
            throw new CustomError(404, "branch no found")
        }
        // verificar si el product existe
        const product = await findProduct(productId, branchId[0]!.branchId)
        // si el producto existe error
        if (product.length > 0) {
            console.log("producto ya existe")
            throw new CustomError(401, "product already exist")
        }

        console.log("creado por primera vez")
        await createProductBranch(price, stock, productId, branchId[0]!.branch_id)

        return
    }
}