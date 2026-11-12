import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateBranchProductController } from "../update_branch_product.controller";
import type { UpdateBranchProductService } from "../update_branch_product.service";

describe("Controller updateProduct PUT /branch-product", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: UpdateBranchProductService;
    let controller: UpdateBranchProductController;

    const productData = {
        boughtPriceProduct: 100,
        currentStock: 20,
        minStock: 5,
        productId: 1,
        sellPriceProduct: 150
    };

    beforeEach(() => {
        req = {
            body: { ...productData },
            user: {
                userId: 2,
                companyId: 1,
                role: "admin"
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            updateBranchProduct: vi.fn()
        } as UpdateBranchProductService;

        controller = new UpdateBranchProductController(service);
    });

    it("should update a branch product successfully", async () => {
        vi.mocked(service.updateBranchProduct).mockResolvedValue(undefined);

        await controller.updateBranchProduct(req, res, next);

        expect(service.updateBranchProduct).toHaveBeenCalledWith(100, 20, 5, 1, 150, 2);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "product updated",
            success: true
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.updateBranchProduct).mockRejectedValue(error);

        await controller.updateBranchProduct(req, res, next);

        expect(service.updateBranchProduct).toHaveBeenCalledWith(100, 20, 5, 1, 150, 2);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});