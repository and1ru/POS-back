import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LogOutController } from "./logOut.controller";

describe("Controller logOut POST /logOut", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let controller: LogOutController;

    beforeEach(() => {
        req = {} as Request;

        res = {
            clearCookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        controller = new LogOutController();
    });

    it("should logout successfully and clear the token cookie", () => {
        controller.logOut(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith("token");

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "log out successed",
            success: true
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if clearing the cookie throws an error", () => {
        const error = new Error("clear cookie error");

        vi.mocked(res.clearCookie).mockImplementation(() => {
            throw error;
        });

        controller.logOut(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith("token");

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});