import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
    findBranchId,
    findBranchProduct,
    createProductBranch
} from '../create_branch_product.repository'
import { myDb } from '../../../helper/pool'

vi.mock("../../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}))

describe("Repository POST /branch-product", () => {
    const userId = 1
    const productId = 1

    const minStock = 5
    const currentStock = 20
    const boughtPriceProduct = 100
    const sellPriceProduct = 150

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("findBranchId", () => {
        it("should return branch id", async () => {
            const response = { branch_id: 1 }

            vi.mocked(myDb.query).mockResolvedValue(response as any)

            const result = await findBranchId(userId)

            expect(myDb.query).toHaveBeenCalledTimes(1)
            expect(result).toEqual(response)
        })

        it("should return an empty array", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any)

            const result = await findBranchId(userId)

            expect(myDb.query).toHaveBeenCalledTimes(1)
            expect(result).toBe(undefined)
        })

        it("should propagate database errors", async () => {
            const error = new Error("Database error")

            vi.mocked(myDb.query).mockRejectedValue(error)

            await expect(findBranchId(userId)).rejects.toBe(error)

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })
    })

    describe("findBranchProduct", () => {
        it("should return product data", async () => {
            const response = [{ id: 1 }]

            vi.mocked(myDb.query).mockResolvedValue([response] as any)

            const result = await findBranchProduct(productId, userId)

            expect(myDb.query).toHaveBeenCalledTimes(1)
            expect(result).toEqual(response)
        })

        it("should return an empty array", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any)

            const result = await findBranchProduct(productId, userId)

            expect(myDb.query).toHaveBeenCalledTimes(1)
            expect(result).toEqual([])
        })

        it("should propagate database errors", async () => {
            const error = new Error("Database error")

            vi.mocked(myDb.query).mockRejectedValue(error)

            await expect(
                findBranchProduct(productId, userId)
            ).rejects.toBe(error)

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })
    })
    

    describe("createProductBranch", () => {
        it("should insert product into branch", async () => {
            vi.mocked(myDb.query).mockResolvedValue([{}] as any)

            await createProductBranch(
                minStock,
                currentStock,
                boughtPriceProduct,
                sellPriceProduct,
                userId,
                productId
            )

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })

        it("should propagate database errors", async () => {
            const error = new Error("Database error")

            vi.mocked(myDb.query).mockRejectedValue(error)

            await expect(
                createProductBranch(
                    minStock,
                    currentStock,
                    boughtPriceProduct,
                    sellPriceProduct,
                    userId,
                    productId
                )
            ).rejects.toBe(error)

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })
    })
})