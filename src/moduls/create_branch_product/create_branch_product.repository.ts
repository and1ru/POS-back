import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface BranchResult extends RowDataPacket {
    branch_id:number
}

export const findBranchId = async (userId:number) => {
    const [result] = await myDb.query<BranchResult[]>("SELECT branch_id FROM employees WHERE user_id=?",[userId])
    return result
}

interface ProductResult extends RowDataPacket {
    id:number
}

export const findBranchProduct = async (productId:number, userId:number) => {
    const [result] = await myDb.query<ProductResult[]>(`
        SELECT id from branch_products WHERE product_id=? AND branch_id= (select branch_id from employees where user_id = ?)
    `,[productId, userId])
    return result
}

export const createProductBranch = async (minStock:number, currentStock:number, boughtPriceProduct:number, sellPriceProduct:number, userId:number, productId:number) => {
    await myDb.query(`
        insert into branch_products 
        (minStock, stock, boughtPriceProduct, sellPriceProduct, branch_id, product_id)
        values (?, ?, ?, ?, ( select branch_id from employees where user_id = ?), ?)
    `,[minStock, currentStock, boughtPriceProduct, sellPriceProduct, userId, productId])
}