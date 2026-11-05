import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthRepository } from '../Auth.repository'
import { AuthService } from '../Auth.service'
import type { DBResponse } from '../Auth.schema'

vi.mock("../Auth.repository")

describe("Service GET /autn", () => {
    let service: AuthService
    const userId = 1
    const value = {
        branch_name: "medellin",
        role: "admin",
        user_name: "andres"
    } as DBResponse | undefined

    beforeEach(() => {
        service = new AuthService()
    })

    it("should return values from repository", async () => {
        vi.mocked(AuthRepository).mockResolvedValue(value)

        const result = await service.auth(userId)

        expect(AuthRepository).toHaveBeenCalledWith(userId)
        expect(result).toEqual(value)
    })

    it("should return an error, user not found", async () => {
        vi.mocked(AuthRepository).mockResolvedValue(undefined)

        await expect(service.auth(userId)).rejects.toMatchObject({status:404, message:"did not find user"})
        expect(AuthRepository).toHaveBeenCalledWith(userId)
    })
})