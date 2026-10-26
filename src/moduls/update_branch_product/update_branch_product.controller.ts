import type { NextFunction, Request, Response } from "express";
import { updateProductSchema } from "./update_branch_product.schema";
import type { UpdateProductService } from "./update_branch_product.service";

export class UpdateProductController {
    constructor(private service:UpdateProductService){}
    updateProduct = async (req:Request, res:Response, next:NextFunction) => {
        const data = updateProductSchema.safeParse(req.body)
        const { userId } = req.user

        if(!data.success){
            return next(data.error)
        }

        try {
            const { boughtPriceProduct, currentStock, minStock, productId, sellPriceProduct } = data.data
            await this.service.updateProduct(boughtPriceProduct, currentStock, minStock, productId, sellPriceProduct, userId)
            return res.status(200).json({message:"product updated", success:true})
        } catch (error) {
            next(error)   
        }
    }
}