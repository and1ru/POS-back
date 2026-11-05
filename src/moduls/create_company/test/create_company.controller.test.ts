
import type { NextFunction, Response, Request } from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CreateCompanyService } from '../create_company.service'
import { CreateCompanyController } from '../create_company.controller'

describe("Controller POST /company", () => {
    let req: Request
    let res: Response
    let next: NextFunction
    let service: CreateCompanyService
    let controller: CreateCompanyController

    const body = {
        companyName: "test company",
        ownerName: "andres",
        email: "andres@gmail.com",
        password: "password123",
        confirmPassword: "password123"
    }

    beforeEach(() => {
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response

        req = {
            body
        } as Request

        next = vi.fn()

        service = {
            createCompany: vi.fn()
        } as unknown as CreateCompanyService

        controller = new CreateCompanyController(service)
    })

    it("should return status 201 when company is created successfully", async () => {
        vi.mocked(service.createCompany).mockResolvedValue(undefined)

        await controller.createCompany(req, res, next)

        expect(service.createCompany).toHaveBeenCalledTimes(1)

        expect(service.createCompany).toHaveBeenCalledWith(
            body.companyName,
            body.ownerName,
            body.email,
            body.password
        )

        expect(res.status).toHaveBeenCalledWith(201)

        expect(res.json).toHaveBeenCalledWith({
            message: "company created",
            success: true
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should call next function after service error", async () => {
        const error = new Error("Database error")

        vi.mocked(service.createCompany).mockRejectedValue(error)

        await controller.createCompany(req, res, next)

        expect(service.createCompany).toHaveBeenCalledWith(
            body.companyName,
            body.ownerName,
            body.email,
            body.password
        )

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()

        expect(next).toHaveBeenCalledWith(error)
    })
})