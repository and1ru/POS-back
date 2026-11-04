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

        update branch_products bp
        inner join sale_product sp on bp.id = sp.branch_product_id

        set bp.stock = bp.stock - sp.quantity

        where sp.sale_id = @saleId
        AND bp.branch_id = @branchId
        AND bp.stock >= sp.quantity;

        commit;
        `, [userId, userId, totalPrice, date, amountReceived, ...values])
}