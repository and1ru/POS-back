import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface ProductResult extends RowDataPacket {
    id:number
}

export const findBranchProductById = async (productId:number) => {
    const [result] = await myDb.query<ProductResult[]>("SELECT id from branch_products WHERE id=?",[productId])
    return result
}

export const updatedBranchProduct = async (boughtPriceProduct:number, currentStock:number, minStock:number, productId:number, sellPriceProduct:number, userId:number) => {
    await myDb.query(`
        update branch_products set
	        stock = ?,
            minStock = ?,
            boughtPriceProduct = ?,
            sellPriceProduct = ?
        where id = ? AND branch_id = (select branch_id from employees where user_id=?)
        `,[currentStock, minStock, boughtPriceProduct, sellPriceProduct, productId, userId])
}