import type { NextFunction, Request, Response } from "express";
import type { NewSaleService } from "./new_sale.service";

export class NewSaleController {
    constructor(private service:NewSaleService){}
    newSale = async (req:Request, res:Response, next:NextFunction) => {
        const { userId } = req.user
        const { amountReceived, products } = req.body

        try {
            await this.service.newSale(products, userId, amountReceived)
            return res.status(201).json({ message:"new sale was created", success:true })
        } catch (error) {
            return next(error)
        }
    }
}