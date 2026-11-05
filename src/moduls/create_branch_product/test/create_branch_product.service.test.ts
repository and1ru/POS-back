import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    createProductBranch,
    findBranchId,
    findBranchProduct
} from '../create_branch_product.repository'
import { CreateProductService } from '../create_branch_product.service'

vi.mock("../create_branch_product.repository")

describe("Service POST /branch-product", () => {
    let service: CreateProductService

    const boughtPriceProduct = 100
    const currentStock = 20
    const minStock = 5
    const sellPriceProduct = 150
    const productId = 1
    const userId = 1

    beforeEach(() => {
        vi.clearAllMocks()
        service = new CreateProductService()
    })

    it("should return an error when branch does not exist", async () => {
        vi.mocked(findBranchId).mockResolvedValue(undefined)

        await expect(
            service.createProduct(
                boughtPriceProduct,
                currentStock,
                minStock,
                sellPriceProduct,
                productId,
                userId
            )
        ).rejects.toMatchObject({
            status: 404,
            message: "branch no found"
        })

        expect(findBranchId).toHaveBeenCalledWith(userId)
        expect(findBranchProduct).not.toHaveBeenCalled()
        expect(createProductBranch).not.toHaveBeenCalled()
    })

    it("should return an error when product already exists", async () => {
        vi.mocked(findBranchId).mockResolvedValue([
            { branch_id: 1 }
        ] as any)

        vi.mocked(findBranchProduct).mockResolvedValue([
            { id: 1 }
        ] as any)

        await expect(
            service.createProduct(
                boughtPriceProduct,
                currentStock,
                minStock,
                sellPriceProduct,
                productId,
                userId
            )
        ).rejects.toMatchObject({
            status: 400,
            message: "product already exist"
        })

        expect(findBranchId).toHaveBeenCalledWith(userId)

        expect(findBranchProduct).toHaveBeenCalledWith(
            productId,
            userId
        )

        expect(createProductBranch).not.toHaveBeenCalled()
    })

    it("should create product successfully", async () => {
        vi.mocked(findBranchId).mockResolvedValue([
            { branch_id: 1 }
        ] as any)

        vi.mocked(findBranchProduct).mockResolvedValue([])

        vi.mocked(createProductBranch).mockResolvedValue(undefined)

        const result = await service.createProduct(
            boughtPriceProduct,
            currentStock,
            minStock,
            sellPriceProduct,
            productId,
            userId
        )

        expect(findBranchId).toHaveBeenCalledWith(userId)

        expect(findBranchProduct).toHaveBeenCalledWith(
            productId,
            userId
        )

        expect(createProductBranch).toHaveBeenCalledTimes(1)

        expect(createProductBranch).toHaveBeenCalledWith(
            minStock,
            currentStock,
            boughtPriceProduct,
            sellPriceProduct,
            userId,
            productId
        )

        expect(result).toBeUndefined()
    })

    it("should propagate findBranchId errors", async () => {
        const error = new Error("Database error")

        vi.mocked(findBranchId).mockRejectedValue(error)

        await expect(
            service.createProduct(
                boughtPriceProduct,
                currentStock,
                minStock,
                sellPriceProduct,
                productId,
                userId
            )
        ).rejects.toBe(error)

        expect(findBranchId).toHaveBeenCalledWith(userId)
    })

    it("should propagate findBranchProduct errors", async () => {
        const error = new Error("Database error")

        vi.mocked(findBranchId).mockResolvedValue([
            { branch_id: 1 }
        ] as any)

        vi.mocked(findBranchProduct).mockRejectedValue(error)

        await expect(
            service.createProduct(
                boughtPriceProduct,
                currentStock,
                minStock,
                sellPriceProduct,
                productId,
                userId
            )
        ).rejects.toBe(error)

        expect(findBranchProduct).toHaveBeenCalledWith(
            productId,
            userId
        )

        expect(createProductBranch).not.toHaveBeenCalled()
    })

    it("should propagate createProductBranch errors", async () => {
        const error = new Error("Database error")

        vi.mocked(findBranchId).mockResolvedValue([
            { branch_id: 1 }
        ] as any)

        vi.mocked(findBranchProduct).mockResolvedValue([])

        vi.mocked(createProductBranch).mockRejectedValue(error)

        await expect(
            service.createProduct(
                boughtPriceProduct,
                currentStock,
                minStock,
                sellPriceProduct,
                productId,
                userId
            )
        ).rejects.toBe(error)

        expect(createProductBranch).toHaveBeenCalledWith(
            minStock,
            currentStock,
            boughtPriceProduct,
            sellPriceProduct,
            userId,
            productId
        )
    })
})