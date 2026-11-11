import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginService } from "../login.service";
import { LoginController } from "../login.controller";

describe("Controller login POST /login", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: LoginService;
    let controller: LoginController;

    const loginData = {
        email: "user@test.com",
        password: "Password123!"
    };

    const token = "generated-jwt-token";

    beforeEach(() => {
        req = {
            body: { ...loginData }
        } as Request;

        res = {
            cookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            login: vi.fn()
        } as unknown as LoginService;

        controller = new LoginController(service);
    });

    it("should login successfully and set the token cookie", async () => {
        vi.mocked(service.login).mockResolvedValue(token);

        await controller.login(req, res, next);

        expect(service.login).toHaveBeenCalledWith(
            loginData.email,
            loginData.password
        );

        expect(res.cookie).toHaveBeenCalledWith("token", token);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "se inicio sesion",
            success: true
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("login error");

        vi.mocked(service.login).mockRejectedValue(error);

        await controller.login(req, res, next);

        expect(service.login).toHaveBeenCalledWith(
            loginData.email,
            loginData.password
        );

        expect(next).toHaveBeenCalledWith(error);

        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});