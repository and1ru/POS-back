import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InventoryService } from "../inventory.service";
import { InventoryController } from "../inventory.controller";

describe("Controller inventory GET /inventory", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: InventoryService;
    let controller: InventoryController;

    const inventoryResult = [
        {
            id: 1,
            name: "Apple",
            image_url: "apple.jpg"
        }
    ];

    beforeEach(() => {
        req = {
            query: {
                productName: "Apple",
                price: "desc",
                stock: "asc"
            },
            user: {
                companyId: 1,
                userId: 2,
                role: "admin"
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            intentory: vi.fn()
        } as unknown as InventoryService;

        controller = new InventoryController(service);
    });

    it("should get inventory successfully", async () => {
        vi.mocked(service.intentory).mockResolvedValue(inventoryResult as any);

        await controller.inventory(req, res, next);

        expect(service.intentory).toHaveBeenCalledWith(
            "admin",
            1,
            2,
            "Apple",
            "desc",
            "asc"
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "got products",
            success: true,
            result: inventoryResult
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should allow requests without optional filters", async () => {
        req.query = {};

        vi.mocked(service.intentory).mockResolvedValue([]);

        await controller.inventory(req, res, next);

        expect(service.intentory).toHaveBeenCalledWith(
            "admin",
            1,
            2,
            undefined,
            undefined,
            undefined
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "got products",
            success: true,
            result: []
        });
    });

    it.each([
        "productName",
        "price",
        "stock"
    ] as const)("should return 400 if %s is an array", async (parameter) => {
        req.query = {
            [parameter]: ["value1", "value2"]
        } as any;

        await controller.inventory(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "",
            success: false
        });

        expect(service.intentory).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.intentory).mockRejectedValue(error);

        await controller.inventory(req, res, next);

        expect(service.intentory).toHaveBeenCalledWith(
            "admin",
            1,
            2,
            "Apple",
            "desc",
            "asc"
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});