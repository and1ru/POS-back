import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface ProductResult extends RowDataPacket {
    id:number
}

export const findProduct = async (productId:number) => {
    const [result] = await myDb.query<ProductResult[]>("SELECT id from branch_products WHERE id=?",[productId])
    return result
}

export const updatedProduct = async (productBranchId:number, stock:number, price:number) => {
    await myDb.query("UPDATE branch_products SET stock=?, price=? WHERE id=?",[stock, price, productBranchId])
}