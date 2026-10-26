import { myDb } from "../../helper/pool"

export const newSaleRepository = async (userId:number, totalPrice:number, date:string, amountReceived:number, placeholder:string, values:number[]) => {
    await myDb.query(`
        start transaction;

        set @branchId = (select branch_id from employees where user_id = ?);

            insert into sales (user_id, total_price, branch_id, date, amountReceived)
            values (?,?,@branchId,?,?);

        set @saleId = last_insert_id();

        insert into sale_product (sale_id, branch_product_id,  price, quantity)
        values ${placeholder};

        commit;
        `, [userId, userId, totalPrice, date, amountReceived, ...values])
}