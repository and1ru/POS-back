import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HistoryService } from "../history.service";
import { HistoryController } from "../history.controller";

describe("Controller GET /history", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: HistoryService;
    let controller: HistoryController;

    const historyResult = [
        {
            id: 15,
            total_price: 50000,
            date: "2026-11-04 10:00:00",
            quantity: 3,
            products: 2
        }
    ];

    beforeEach(() => {
        req = {
            query: {
                saleId: "15",
                date: "today"
            },
            user: {
                userId: 3,
                role: "cashier"
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            history: vi.fn()
        } as unknown as HistoryService;

        controller = new HistoryController(service);
    });

    it("should get sales history successfully", async () => {
        vi.mocked(service.history).mockResolvedValue(historyResult as any);

        await controller.history(req, res, next);

        expect(service.history).toHaveBeenCalledWith(
            3,
            "cashier",
            "today",
            "15"
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "got sales history",
            success: true,
            result: historyResult
        });

        expect(next).not.toHaveBeenCalled();
    });

    it.each([
        "saleId",
        "date"
    ] as const)("should return 400 if %s is an array", async (parameter) => {
        req.query = {
            [parameter]: ["value1", "value2"]
        } as any;

        await controller.history(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "data error",
            success: false
        });

        expect(service.history).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.history).mockRejectedValue(error);

        await controller.history(req, res, next);

        expect(service.history).toHaveBeenCalledWith(
            3,
            "cashier",
            "today",
            "15"
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});