import type { NextFunction, Request, Response } from "express";
import { newSale } from "./new_sale.schema";
import type { NewSaleService } from "./new_sale.service";

export class NewSaleController {
    constructor(private service:NewSaleService){}
    newSale = async (req:Request, res:Response, next:NextFunction) => {
        const data = newSale.safeParse(req.body)
        const { userId } = req.user

        if(!data.success){
            return next(data.error)
        }

        try {
            const { amountReceived, products } = data.data
            await this.service.newSale(products, userId, amountReceived)
            return res.status(201).json({ message:"new sale was created", success:true })
        } catch (error) {
            next(error)
        }
    }
}