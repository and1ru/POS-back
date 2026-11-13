import { newSaleRepository } from "./new_sale.repository";
import type { productType } from "./new_sale.schema";

// debe verificar que el branch product sea de la misma branch
// debe verificar que hay un stock suficiente
// no debe confiar en el precio que manda desde el front

export class NewSaleService {
    newSale = async (products:productType[], userId:number, amountReceived:number) => {
        const placeholder = products.map(() => "(@saleId, ?, ?, ?)").join(", ")
        const values = products.flatMap((product) => [product.id, product.price, product.quantity])

        const total = products.reduce((total, product) => total + (product.price * product.quantity) ,0)

        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()

        const finalDate = `${year}-${month + 1}-${day}`

        await newSaleRepository( userId, total, finalDate, amountReceived, placeholder, values)
    }
}