import type { NextFunction, Request, Response } from "express";
import type { CreateProductService } from "./create_branch_product.service";

export class CreateProductController {
  constructor(private service: CreateProductService) {}
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user
    const {boughtPriceProduct, currentStock, minStock, sellPriceProduct, productId} = req.body

    try {
      await this.service.createProduct(boughtPriceProduct, currentStock, minStock, sellPriceProduct, productId, userId);
      return res.status(201).json({ message: "product created", success: true });
    } catch (error) {
      next(error);
    }
  };
}