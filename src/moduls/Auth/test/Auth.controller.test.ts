import type { NextFunction, Response, Request } from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AuthService } from '../Auth.service'
import { AuthController } from '../Auth.controller'
import type { DBResponse } from '../Auth.schema'

describe("Controller GET /auth", () => {
    let req: Request
    let res: Response
    let next: NextFunction
    let service: AuthService
    let controller: AuthController

    beforeEach(() => {
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response

        req = {
            user: {
                userId: 1
            }
        } as Request

        next = vi.fn()

        service = {
            auth: vi.fn()
        }

        controller = new AuthController(service)
    })

    it("should return status 200 when authentication is successful", async () => {
        const result = [{
            user_name: "andres",
            role: "admin",
            branch_name: "medellin"
        }] as DBResponse[]

        vi.mocked(service.auth).mockResolvedValue(result)

        await controller.auth(req, res, next)

        expect(service.auth).toHaveBeenCalledWith(req.user.userId)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ success:true, message:"authenticated", result})
        expect(next).not.toHaveBeenCalled()
    })

    it("should call next function after service error", async () => {
        const error = new Error()
        vi.mocked(service.auth).mockRejectedValue(error)

        await controller.auth(req, res, next)

        expect(service.auth).toHaveBeenCalledWith(req.user.userId)
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    })
})