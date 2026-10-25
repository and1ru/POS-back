import type { NextFunction, Request, Response } from "express";
import { updateProductSchema } from "./create_branch_product.schema";
import type { CreateProductService } from "./create_branch_product.service";

export class CreateProductController {
  constructor(private service: CreateProductService) {}
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = updateProductSchema.safeParse(req.body);
    const { userId } = req.user

    if (!data.success) {
      return next(data.error);
    }

    try {
      const { boughtPriceProduct, currentStock, minStock, sellPriceProduct, productId } = data.data;
      await this.service.createProduct(boughtPriceProduct, currentStock, minStock, sellPriceProduct, productId, userId);
      return res.status(200).json({ message: "product updated", success: true });
    } catch (error) {
      next(error);
    }
  };
}
