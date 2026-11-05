import type { NextFunction, Response, Request } from 'express'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CreateProductService } from '../create_branch_product.service'
import { CreateProductController } from '../create_branch_product.controller'

describe("Controller POST /branch-product", () => {
    let req: Request
    let res: Response
    let next: NextFunction
    let service: CreateProductService
    let controller: CreateProductController

    const body = {
        boughtPriceProduct: 100,
        currentStock: 20,
        minStock: 5,
        sellPriceProduct: 150,
        productId: 1
    }

    beforeEach(() => {
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response

        req = {
            user: {
                userId: 1
            },
            body
        } as Request

        next = vi.fn()

        service = {
            createProduct: vi.fn()
        } as unknown as CreateProductService

        controller = new CreateProductController(service)
    })

    it("should return status 201 when product is created successfully", async () => {
        vi.mocked(service.createProduct).mockResolvedValue(undefined)

        await controller.createProduct(req, res, next)

        expect(service.createProduct).toHaveBeenCalledTimes(1)

        expect(service.createProduct).toHaveBeenCalledWith(
            body.boughtPriceProduct,
            body.currentStock,
            body.minStock,
            body.sellPriceProduct,
            body.productId,
            req.user.userId
        )

        expect(res.status).toHaveBeenCalledWith(201)

        expect(res.json).toHaveBeenCalledWith({
            message: "product created",
            success: true
        })

        expect(next).not.toHaveBeenCalled()
    })

    it("should call next function after service error", async () => {
        const error = new Error("Database error")

        vi.mocked(service.createProduct).mockRejectedValue(error)

        await controller.createProduct(req, res, next)

        expect(service.createProduct).toHaveBeenCalledWith(
            body.boughtPriceProduct,
            body.currentStock,
            body.minStock,
            body.sellPriceProduct,
            body.productId,
            req.user.userId
        )

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()

        expect(next).toHaveBeenCalledWith(error)
    })
})