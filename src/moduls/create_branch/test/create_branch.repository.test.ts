import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createBranchRepository } from '../create_branch.repository'
import { myDb } from '../../../helper/pool'

vi.mock("../../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}))

describe("Repository POST /branch", () => {
    const address = "Calle 10 #20-30"
    const city = "Medellin"
    const name = "Sucursal Centro"
    const companyId = 1

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should insert a new branch", async () => {

        vi.mocked(myDb.query).mockResolvedValue([{}] as any)

        await createBranchRepository(address, city, name, companyId)

        expect(myDb.query).toHaveBeenCalledTimes(1)
    })

    it("should propagate database errors", async () => {
        const error = new Error("Database error")

        vi.mocked(myDb.query).mockRejectedValue(error)

        await expect(
            createBranchRepository(address,city,name,companyId)
        ).rejects.toBe(error)

        expect(myDb.query).toHaveBeenCalledTimes(1)
    })
})