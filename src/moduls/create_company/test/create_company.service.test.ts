import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CreateCompanyRepository, findUserByEmail } from '../create_company.repository'
import { CreateCompanyService } from '../create_company.service'
import { hashPassword } from '../../../helper/hashPassword'
import { CustomError } from '../../../helper/cutomError'

vi.mock("../create_company.repository")

vi.mock("../../../helper/hashPassword", () => ({
    hashPassword: vi.fn()
}))

describe("Service POST /company", () => {
    let service: CreateCompanyService

    const companyName = "test company"
    const ownerName = "andres"
    const email = "andres@gmail.com"
    const password = "123456789"
    const date = "2000-01-01"

    beforeEach(() => {
        vi.clearAllMocks()
        service = new CreateCompanyService()
    })

    it("should create company and owner successfully", async () => {
        vi.mocked(findUserByEmail).mockResolvedValue({email: "test@gmail.com"} as any)
        vi.mocked(hashPassword).mockResolvedValue("hashed-password")
        vi.mocked(CreateCompanyRepository).mockResolvedValue(undefined)

        await service.createCompany(
            companyName,
            ownerName,
            email,
            password
        )

        expect(findUserByEmail).toHaveBeenCalledTimes(1)
        expect(findUserByEmail).toHaveBeenCalledWith(email)

        expect(hashPassword).toHaveBeenCalledTimes(1)
        expect(hashPassword).toHaveBeenCalledWith(password)

        expect(CreateCompanyRepository).toHaveBeenCalledTimes(1)

        expect(CreateCompanyRepository).toHaveBeenCalledWith(
            companyName,
            date,
            ownerName,
            email,
            "hashed-password"
        )
    })

    it("should return an error when email already exists", async () => {
        vi.mocked(findUserByEmail).mockResolvedValue({
            email
        } as any)

        await expect(
            service.createCompany(companyName, ownerName, email, password)
        ).rejects.toMatchObject({
            status: 400,
            message: "credentials error"
        })

        expect(findUserByEmail).toHaveBeenCalledWith(email)

        expect(hashPassword).not.toHaveBeenCalled()
        expect(CreateCompanyRepository).not.toHaveBeenCalled()
    })

    it("should propagate findUserByEmail errors", async () => {
        const error = new Error("Database error")

        vi.mocked(findUserByEmail).mockRejectedValue(error)

        await expect(
            service.createCompany(companyName, ownerName, email, password)
        ).rejects.toBe(error)

        expect(findUserByEmail).toHaveBeenCalledWith(email)

        expect(hashPassword).not.toHaveBeenCalled()
        expect(CreateCompanyRepository).not.toHaveBeenCalled()
    })

    it("should propagate hashPassword errors", async () => {
        const error = new CustomError(400, "credentials error")

        vi.mocked(findUserByEmail).mockResolvedValue({email: "test@gmail.com"} as any)
        vi.mocked(hashPassword).mockRejectedValue(error)

        await expect(
            service.createCompany(companyName, ownerName, email, password)
        ).rejects.toBe(error)

        expect(findUserByEmail).toHaveBeenCalledWith(email)
        expect(hashPassword).toHaveBeenCalledWith(password)

        expect(CreateCompanyRepository).not.toHaveBeenCalled()
    })

    it("should propagate CreateCompanyRepository errors", async () => {
        const error = new CustomError(400, "credentials error")

        vi.mocked(findUserByEmail).mockResolvedValue({email: "test@gmail.com"} as any)
        vi.mocked(hashPassword).mockResolvedValue("hashed-password")
        vi.mocked(CreateCompanyRepository).mockRejectedValue(error)

        await expect(
            service.createCompany(companyName, ownerName, email, password)
        ).rejects.toBe(error)

        expect(findUserByEmail).toHaveBeenCalledWith(email)
        expect(hashPassword).toHaveBeenCalledWith(password)

        expect(CreateCompanyRepository).toHaveBeenCalledWith(
            companyName,
            ownerName,
            email,
            "hashed-password"
        )
    })
})