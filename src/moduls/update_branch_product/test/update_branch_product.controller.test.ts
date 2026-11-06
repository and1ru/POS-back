import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateProductController } from "./update_branch_product.controller";
import type { UpdateProductService } from "./update_branch_product.service";

describe("Controller updateProduct PUT /branch-product", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: UpdateProductService;
    let controller: UpdateProductController;

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
            updateProduct: vi.fn()
        } as unknown as UpdateProductService;

        controller = new UpdateProductController(service);
    });

    it("should update a branch product successfully", async () => {
        vi.mocked(service.updateProduct).mockResolvedValue(undefined);

        await controller.updateProduct(req, res, next);

        expect(service.updateProduct).toHaveBeenCalledWith(
            100,
            20,
            5,
            1,
            150,
            2
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "product updated",
            success: true
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.updateProduct).mockRejectedValue(error);

        await controller.updateProduct(req, res, next);

        expect(service.updateProduct).toHaveBeenCalledWith(
            100,
            20,
            5,
            1,
            150,
            2
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});