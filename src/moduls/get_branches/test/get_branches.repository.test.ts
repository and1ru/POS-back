import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getBranchesRepository } from '../get_branches.repository'
import { myDb } from '../../../helper/pool'

vi.mock("../../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}))

describe("Repository GET /branch", () => {
    const companyId = 1

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return branches", async () => {
        const response = [
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
        ]

        vi.mocked(myDb.query).mockResolvedValue([response] as any)

        const result = await getBranchesRepository(companyId)

        expect(myDb.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual(response)
    })

    it("should return an empty array", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[]] as any)

        const result = await getBranchesRepository(companyId)

        expect(myDb.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual([])
    })

    it("should propagate database errors", async () => {
        const error = new Error("Database error")

        vi.mocked(myDb.query).mockRejectedValue(error)

        await expect(
            getBranchesRepository(companyId)
        ).rejects.toBe(error)

        expect(myDb.query).toHaveBeenCalledTimes(1)
    })
})