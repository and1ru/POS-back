import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthRepository } from '../Auth.repository'
import { myDb } from '../../../helper/pool'
import type { DBResponse } from '../Auth.schema'

vi.mock("../../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}))

describe("Repository GET /auth", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return user data", async () => {
        const response = {
                branch_name: "medellin",
                role: "admin",
                user_name: "andres"
            } as DBResponse
        const userId = 1

        vi.mocked(myDb.query).mockResolvedValue([[response],[]] as any)
        const result = await AuthRepository(userId)

        expect(myDb.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual(response)
    })

    it("should return an empty array", async () => {
        const userId = 999

        vi.mocked(myDb.query).mockResolvedValueOnce([[]] as any)

        const result = await AuthRepository(userId)
        expect(result).toEqual(undefined)
    })
})