import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface BranchResult extends RowDataPacket {
    branch_id:number
}

export const findBranchId = async (userId:number) => {
    console.log("1")
    const [result] = await myDb.query<BranchResult[]>("SELECT branch_id FROM employee WHERE user_id=?",[userId])
    return result
}

interface ProductResult extends RowDataPacket {
    id:number
}

export const findProduct = async (productId:number, branchId:number) => {
    console.log("2")
    const [result] = await myDb.query<ProductResult[]>("SELECT id from branch_products WHERE product_id=? AND branch_id=?",[productId, branchId])
    return result
}

export const createProductBranch = async (price:number, stock:number,productId:number, branchId:number) => {
    console.log("3")
    await myDb.query("INSERT INTO branch_products (price,stock,branch_id,product_id) VALUES (?,?,?,?) ",[price, stock, branchId, productId])
}