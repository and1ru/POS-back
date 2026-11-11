import type { NextFunction, Request, Response } from "express";
import type { UpdateBranchProductService } from "./update_branch_product.service";

export class UpdateProductController {
    constructor(private service:UpdateBranchProductService){}
    updateProduct = async (req:Request, res:Response, next:NextFunction) => {
        const { boughtPriceProduct, currentStock, minStock, productId, sellPriceProduct } = req.body
        const { userId } = req.user

        try {
            await this.service.updateBranchProduct(boughtPriceProduct, currentStock, minStock, productId, sellPriceProduct, userId)
            return res.status(200).json({message:"product updated", success:true})
        } catch (error) {
            return next(error)   
        }
    }
}