import type { NextFunction, Request, Response } from "express";
import { updateProductSchema } from "./update_branch_product.schema";
import type { UpdateProductService } from "./update_branch_product.service";

export class UpdateProductController {
    constructor(private service:UpdateProductService){}
    updateProduct = async (req:Request, res:Response, next:NextFunction) => {
        const data = updateProductSchema.safeParse(req.body)

        if(!data.success){
            return next(data.error)
        }

        try {
            const { price, productId, stock } = data.data
            await this.service.updateProduct(price, productId, stock)
            return res.status(200).json({message:"product updated", success:true})
        } catch (error) {
            next(error)   
        }
    }
}