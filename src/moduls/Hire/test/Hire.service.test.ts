import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HireSerivce } from "../Hire.service";
import { hashPassword } from "../../../helper/hashPassword";
import { findUserByEmail } from "../../create_company/create_company.repository";
import { hireByAdmin, hireByOwner } from "../Hire.repository";

vi.mock("../../helper/hashPassword", () => ({
    hashPassword: vi.fn()
}));

vi.mock("../create_company/create_company.repository", () => ({
    findUserByEmail: vi.fn()
}));

vi.mock("./Hire.repository", () => ({
    hireByAdmin: vi.fn(),
    hireByOwner: vi.fn()
}));

describe("Service POST /hire", () => {
    let service: HireSerivce;

    const hireData = {
        name: "Employee One",
        email: "employee@test.com",
        password: "password123",
        role: "cashier",
        companyId: 1,
        branchId: 2,
        salary: 1500,
        userId: 3
    };

    const hashedPassword = "hashed-password";
    const currentDate = "2026-11-4";

    beforeEach(() => {
        vi.clearAllMocks();

        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-04T12:00:00"));

        service = new HireSerivce();

        vi.mocked(findUserByEmail).mockResolvedValue(null as any);
        vi.mocked(hashPassword).mockResolvedValue(hashedPassword);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should hire an employee successfully as owner", async () => {
        await service.hire(
            hireData.name,
            hireData.email,
            hireData.password,
            hireData.role,
            hireData.companyId,
            hireData.branchId,
            hireData.salary,
            "owner",
            hireData.userId
        );

        expect(findUserByEmail).toHaveBeenCalledWith(hireData.email);
        expect(hashPassword).toHaveBeenCalledWith(hireData.password);

        expect(hireByOwner).toHaveBeenCalledWith(
            hireData.name,
            hireData.email,
            hashedPassword,
            hireData.role,
            hireData.companyId,
            hireData.branchId,
            hireData.salary,
            currentDate
        );

        expect(hireByAdmin).not.toHaveBeenCalled();
    });

    it("should hire a cashier successfully as admin", async () => {
        await service.hire(
            hireData.name,
            hireData.email,
            hireData.password,
            "cashier",
            hireData.companyId,
            hireData.branchId,
            hireData.salary,
            "admin",
            hireData.userId
        );

        expect(findUserByEmail).toHaveBeenCalledWith(hireData.email);
        expect(hashPassword).toHaveBeenCalledWith(hireData.password);

        expect(hireByAdmin).toHaveBeenCalledWith(
            hireData.name,
            hireData.email,
            hashedPassword,
            hireData.companyId,
            hireData.userId,
            currentDate,
            hireData.salary
        );

        expect(hireByOwner).not.toHaveBeenCalled();
    });

    it("should throw an error if the email already exists", async () => {
        vi.mocked(findUserByEmail).mockResolvedValue({
            id: 10,
            email: hireData.email
        } as any);

        await expect(
            service.hire(
                hireData.name,
                hireData.email,
                hireData.password,
                hireData.role,
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                "owner",
                hireData.userId
            )
        ).rejects.toThrow("credentials error");

        expect(hashPassword).not.toHaveBeenCalled();
        expect(hireByOwner).not.toHaveBeenCalled();
        expect(hireByAdmin).not.toHaveBeenCalled();
    });

    it("should propagate errors when checking the email", async () => {
        const error = new Error("database error");

        vi.mocked(findUserByEmail).mockRejectedValue(error);

        await expect(
            service.hire(
                hireData.name,
                hireData.email,
                hireData.password,
                hireData.role,
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                "owner",
                hireData.userId
            )
        ).rejects.toBe(error);

        expect(hashPassword).not.toHaveBeenCalled();
        expect(hireByOwner).not.toHaveBeenCalled();
    });

    it("should propagate errors when hashing the password", async () => {
        const error = new Error("hash error");

        vi.mocked(hashPassword).mockRejectedValue(error);

        await expect(
            service.hire(
                hireData.name,
                hireData.email,
                hireData.password,
                hireData.role,
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                "owner",
                hireData.userId
            )
        ).rejects.toBe(error);

        expect(hireByOwner).not.toHaveBeenCalled();
        expect(hireByAdmin).not.toHaveBeenCalled();
    });

    it("should not allow an admin to hire another admin", async () => {
        await expect(
            service.hire(
                hireData.name,
                hireData.email,
                hireData.password,
                "admin",
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                "admin",
                hireData.userId
            )
        ).rejects.toThrow("admin can not hire an admin");

        expect(findUserByEmail).toHaveBeenCalledWith(hireData.email);
        expect(hashPassword).toHaveBeenCalledWith(hireData.password);

        expect(hireByAdmin).not.toHaveBeenCalled();
        expect(hireByOwner).not.toHaveBeenCalled();
    });

    it("should propagate errors from hireByOwner", async () => {
        const error = new Error("owner repository error");

        vi.mocked(hireByOwner).mockRejectedValue(error);

        await expect(
            service.hire(
                hireData.name,
                hireData.email,
                hireData.password,
                hireData.role,
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                "owner",
                hireData.userId
            )
        ).rejects.toBe(error);
    });

    it("should propagate errors from hireByAdmin", async () => {
        const error = new Error("admin repository error");

        vi.mocked(hireByAdmin).mockRejectedValue(error);

        await expect(
            service.hire(
                hireData.name,
                hireData.email,
                hireData.password,
                "cashier",
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                "admin",
                hireData.userId
            )
        ).rejects.toBe(error);
    });

    it("should not call a repository for an unsupported user role", async () => {
        await service.hire(
            hireData.name,
            hireData.email,
            hireData.password,
            hireData.role,
            hireData.companyId,
            hireData.branchId,
            hireData.salary,
            "cashier",
            hireData.userId
        );

        expect(hireByOwner).not.toHaveBeenCalled();
        expect(hireByAdmin).not.toHaveBeenCalled();
    });
});