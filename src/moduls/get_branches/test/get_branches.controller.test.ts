import type { DbResponse } from '../get_branches.schema'
import type { NextFunction, Response, Request } from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { GetBranchesService } from '../get_branches.service'
import { GetBranchesController } from '../get_branches.controller'

describe("Controller GET /branch", () => {
    let req: Request
    let res: Response
    let next: NextFunction
    let service: GetBranchesService
    let controller: GetBranchesController

    beforeEach(() => {
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response

        req = {
            user: {
                companyId: 1
            }
        } as Request

        next = vi.fn()

        service = {
            getBranches: vi.fn()
        } as unknown as GetBranchesService

        controller = new GetBranchesController(service)
    })

    it("should return status 200 when branches are retrieved successfully", async () => {
        const result = [
            {
                id: 1,
                name: "Sucursal Centro",
                city: "Medellin"
            },
            {
                id: 2,
                name: "Sucursal Norte",
                city: "Bogota"
            }
        ] as DbResponse[]

        vi.mocked(service.getBranches).mockResolvedValue(result)

        await controller.getBranches(req, res, next)

        expect(service.getBranches).toHaveBeenCalledTimes(1)
        expect(service.getBranches).toHaveBeenCalledWith(req.user.companyId)

        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith({
            message: "got branches",
            status: true,
            result
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should return an empty array when company has no branches", async () => {
        vi.mocked(service.getBranches).mockResolvedValue([])

        await controller.getBranches(req, res, next)

        expect(service.getBranches).toHaveBeenCalledWith(req.user.companyId)

        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith({
            message: "got branches",
            status: true,
            result: []
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should call next function after service error", async () => {
        const error = new Error("Database error")

        vi.mocked(service.getBranches).mockRejectedValue(error)

        await controller.getBranches(req, res, next)

        expect(service.getBranches).toHaveBeenCalledWith(req.user.companyId)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()

        expect(next).toHaveBeenCalledWith(error)
    })
})
