import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewSaleController } from "./new_sale.controller";
import type { NewSaleService } from "./new_sale.service";

describe("Controller newSale POST /sale", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: NewSaleService;
    let controller: NewSaleController;

    const saleBody = {
        amountReceived: 600,
        products: [
            { id: 1, price: 150, quantity: 2 },
            { id: 2, price: 250, quantity: 1 }
        ]
    };

    beforeEach(() => {
        req = {
            body: { ...saleBody },
            user: {
                userId: 3,
                role: "cashier",
                companyId: 1
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            newSale: vi.fn()
        } as unknown as NewSaleService;

        controller = new NewSaleController(service);
    });

    it("should create a sale successfully", async () => {
        vi.mocked(service.newSale).mockResolvedValue(undefined);

        await controller.newSale(req, res, next);

        expect(service.newSale).toHaveBeenCalledWith(
            saleBody.products,
            3,
            600
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "new sale was created",
            success: true
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.newSale).mockRejectedValue(error);

        await controller.newSale(req, res, next);

        expect(service.newSale).toHaveBeenCalledWith(
            saleBody.products,
            3,
            600
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});