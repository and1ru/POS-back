
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getBranchesRepository } from '../get_branches.repository'
import { GetBranchesService } from '../get_branches.service'
import type { DbResponse } from '../get_branches.schema'

vi.mock("../get_branches.repository")

describe("Service GET /branch", () => {
    let service: GetBranchesService

    const companyId = 1

    const value = [
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

    beforeEach(() => {
        vi.clearAllMocks()
        service = new GetBranchesService()
    })

    it("should return branches from repository", async () => {
        vi.mocked(getBranchesRepository).mockResolvedValue(value)

        const result = await service.getBranches(companyId)

        expect(getBranchesRepository).toHaveBeenCalledTimes(1)
        expect(getBranchesRepository).toHaveBeenCalledWith(companyId)

        expect(result).toEqual(value)
    })

    it("should return an empty array when company has no branches", async () => {
        vi.mocked(getBranchesRepository).mockResolvedValue([])

        const result = await service.getBranches(companyId)

        expect(getBranchesRepository).toHaveBeenCalledWith(companyId)

        expect(result).toEqual([])
    })

    it("should propagate repository errors", async () => {
        const error = new Error("Database error")

        vi.mocked(getBranchesRepository).mockRejectedValue(error)

        await expect(
            service.getBranches(companyId)
        ).rejects.toBe(error)

        expect(getBranchesRepository).toHaveBeenCalledWith(companyId)
    })
})
