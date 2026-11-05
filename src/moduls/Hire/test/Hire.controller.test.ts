import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HireSerivce } from "../Hire.service";
import { HireController } from "../Hire.controller";

describe("Controller POST /hire", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: HireSerivce;
    let controller: HireController;

    const hireBody = {
        name: "Employee One",
        email: "employee@test.com",
        password: "password123",
        role: "cashier",
        salary: 1500,
        branch: "1"
    };

    beforeEach(() => {
        req = {
            body: { ...hireBody },
            user: {
                companyId: 1,
                role: "owner",
                userId: 1
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            hire: vi.fn()
        } as unknown as HireSerivce;

        controller = new HireController(service);
    });

    it("should hire an employee successfully", async () => {
        vi.mocked(service.hire).mockResolvedValue(undefined);

        await controller.hire(req, res, next);

        expect(service.hire).toHaveBeenCalledWith(
            "Employee One",
            "employee@test.com",
            "password123",
            "cashier",
            1,
            1,
            1500,
            "owner",
            1
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "employee hire",
            success: true
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should convert branch to a number before calling the service", async () => {
        req.body.branch = "10";

        vi.mocked(service.hire).mockResolvedValue(undefined);

        await controller.hire(req, res, next);

        expect(service.hire).toHaveBeenCalledWith(
            "Employee One",
            "employee@test.com",
            "password123",
            "cashier",
            1,
            10,
            1500,
            "owner",
            1
        );
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.hire).mockRejectedValue(error);

        await controller.hire(req, res, next);

        expect(service.hire).toHaveBeenCalledWith(
            "Employee One",
            "employee@test.com",
            "password123",
            "cashier",
            1,
            1,
            1500,
            "owner",
            1
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});