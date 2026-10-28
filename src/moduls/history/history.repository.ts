import { myDb } from "../../helper/pool"

export const historyCashier = async (userId:number, saleId:string, start:Date, end:Date) => {
    const [result] = await myDb.query(`
        SELECT 
	        s.id,
            s.total_price,
            s.date,
            SUM(sp.quantity) AS quantity,
            COUNT(sp.sale_id) AS products
        FROM sales s
        LEFT JOIN sale_product sp on sp.sale_id = s.id

        WHERE 
            s.user_id = ? AND
            s.id like ? AND
            s.date >= ? AND
            s.date < ?
        GROUP BY s.id
        `,[userId, saleId, start, end])

    return result
}

export const historyAdmin = async (userId:number, saleId:string, start:Date, end:Date) => {
    const [result] = await myDb.query(`
        SELECT 
	        s.id,
            s.total_price,
            s.date,
            SUM(sp.quantity) AS quantity,
            COUNT(sp.sale_id) AS products
        FROM sales s
        LEFT JOIN sale_product sp on sp.sale_id = s.id

        WHERE 
            s.branch_id = (select branch_id from employees where user_id = ?) AND
            s.id like ? AND
            s.date >= ? AND
            s.date < ?
        GROUP BY s.id
        `,[userId, saleId, start, end])

    return result
}

export const historyOwner = async (userId:number, saleId:string, start:Date, end:Date) => {
    const [result] = await myDb.query(`
        SELECT 
	        s.id,
            s.total_price,
            s.date,
            SUM(sp.quantity) AS quantity,
            COUNT(sp.sale_id) AS products
        FROM sales s
        LEFT JOIN sale_product sp on sp.sale_id = s.id AND
        

        WHERE 
            s.branch_id = (select branch_id from employees where user_id = ?) AND
            s.id like ? AND
            s.date >= ? AND
            s.date < ?
        GROUP BY s.id
        `,[userId, saleId, start, end])

    return result
}