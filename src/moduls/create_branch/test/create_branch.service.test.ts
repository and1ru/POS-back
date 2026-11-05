import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createBranchRepository } from '../create_branch.repository'
import { CreateBranchService } from '../create_branch.service'

vi.mock("../create_branch.repository")

describe("Service POST /branch", () => {
    let service: CreateBranchService

    const address = "Calle 10 #20-30"
    const city = "Medellin"
    const name = "Sucursal Centro"
    const companyId = 1

    beforeEach(() => {
        vi.mocked(createBranchRepository).mockReset()
        service = new CreateBranchService()
    })

    it("should create a branch successfully", async () => {
        vi.mocked(createBranchRepository).mockResolvedValue(undefined)

        const result = await service.createBranch(address,city,name,companyId)

        expect(createBranchRepository).toHaveBeenCalledTimes(1)

        expect(createBranchRepository).toHaveBeenCalledWith(address,city,name,companyId)

        expect(result).toBeUndefined()
    })

    it("should propagate repository errors", async () => {
        const error = new Error("Database error")

        vi.mocked(createBranchRepository).mockRejectedValue(error)

        await expect(
            service.createBranch(address,city,name,companyId)
        ).rejects.toBe(error)

        expect(createBranchRepository).toHaveBeenCalledWith(address,city,name,companyId)
    })
})