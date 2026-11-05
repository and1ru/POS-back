import type { NextFunction, Response, Request } from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CreateBranchService } from '../create_branch.service'
import { CreateBranchController } from '../create_branch.controller'

describe("Controller POST /branch", () => {
    let req: Request
    let res: Response
    let next: NextFunction
    let service: CreateBranchService
    let controller: CreateBranchController

    const body = {
        address: "Calle 10 #20-30",
        city: "Medellin",
        name: "Sucursal Centro"
    }

    beforeEach(() => {
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response

        req = {
            user: {
                companyId: 1
            },
            body
        } as Request

        next = vi.fn()

        service = {
            createBranch: vi.fn()
        } as unknown as CreateBranchService

        controller = new CreateBranchController(service)
    })

    it("should return status 201 when branch is created successfully", async () => {
        vi.mocked(service.createBranch).mockResolvedValue(undefined)

        await controller.createBranch(req, res, next)

        expect(service.createBranch).toHaveBeenCalledTimes(1)

        expect(service.createBranch).toHaveBeenCalledWith(
            body.address,
            body.city,
            body.name,
            req.user.companyId
        )

        expect(res.status).toHaveBeenCalledWith(201)

        expect(res.json).toHaveBeenCalledWith({
            message: "branch created",
            success: true
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should call next function after service error", async () => {
        const error = new Error("Database error")

        vi.mocked(service.createBranch).mockRejectedValue(error)

        await controller.createBranch(req, res, next)

        expect(service.createBranch).toHaveBeenCalledWith(
            body.address,
            body.city,
            body.name,
            req.user.companyId
        )

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()

        expect(next).toHaveBeenCalledWith(error)
    })
})