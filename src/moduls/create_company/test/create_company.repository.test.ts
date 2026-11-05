import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateCompanyRepository, findUserByEmail } from '../create_company.repository'
import { myDb } from '../../../helper/pool'

vi.mock("../../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}))

describe("Repository POST /company", () => {
    const companyName = "test company"
    const date = "2026-01-01"
    const ownerName = "andres"
    const email = "andres@gmail.com"
    const password = "hashed-password"

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("CreateCompanyRepository", () => {
        it("should create company and owner successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([{}] as any)

            await CreateCompanyRepository(
                companyName,
                date,
                ownerName,
                email,
                password
            )

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })

        it("should propagate database errors", async () => {
            const error = new Error("Database error")

            vi.mocked(myDb.query).mockRejectedValue(error)

            await expect(
                CreateCompanyRepository(
                    companyName,
                    date,
                    ownerName,
                    email,
                    password
                )
            ).rejects.toBe(error)

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })
    })

    describe("findUserByEmail", () => {
        it("should return user data", async () => {
            const response = [{ email }]

            vi.mocked(myDb.query).mockResolvedValue([response] as any)

            const result = await findUserByEmail(email)

            expect(myDb.query).toHaveBeenCalledTimes(1)
            expect(result).toEqual(response[0])
        })

        it("should return undefined when user does not exist", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any)

            const result = await findUserByEmail(email)

            expect(myDb.query).toHaveBeenCalledTimes(1)
            expect(result).toBeUndefined()
        })

        it("should propagate database errors", async () => {
            const error = new Error("Database error")

            vi.mocked(myDb.query).mockRejectedValue(error)

            await expect(findUserByEmail(email)).rejects.toBe(error)

            expect(myDb.query).toHaveBeenCalledTimes(1)
        })
    })
})