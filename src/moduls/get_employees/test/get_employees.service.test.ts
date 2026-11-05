import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeesService } from "../get_employees.service";
import { employeesAdmin, employeesOwner } from "../get_employees.repository";

vi.mock("./get_employees.repository", () => ({
    employeesAdmin: vi.fn(),
    employeesOwner: vi.fn()
}));

describe("Service GET /employees", () => {
    let service: EmployeesService;

    const employeeResult = [
        {
            id: 4,
            name: "Ana Lopez",
            role: "cashier",
            branch_name: "Branch One"
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        service = new EmployeesService();
    });

    describe("employee as owner", () => {
        it("should get employees with the provided filters", async () => {
            vi.mocked(employeesOwner).mockResolvedValue(employeeResult as any);

            const result = await service.employee(
                "owner",
                1,
                1,
                "Ana",
                "cashier",
                "1"
            );

            expect(employeesOwner).toHaveBeenCalledWith(
                1,
                "%Ana%",
                "%cashier%",
                "%1%"
            );

            expect(employeesAdmin).not.toHaveBeenCalled();
            expect(result).toEqual(employeeResult);
        });

        it("should use default filters when no filters are provided", async () => {
            vi.mocked(employeesOwner).mockResolvedValue(employeeResult as any);

            const result = await service.employee(
                "owner",
                1,
                1,
                undefined,
                undefined,
                undefined
            );

            expect(employeesOwner).toHaveBeenCalledWith(
                1,
                "%",
                "%",
                "%"
            );

            expect(result).toEqual(employeeResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(employeesOwner).mockRejectedValue(error);

            await expect(
                service.employee(
                    "owner",
                    1,
                    1,
                    "Ana",
                    "cashier",
                    "1"
                )
            ).rejects.toBe(error);
        });
    });

    describe("employee as admin", () => {
        it("should get employees from the admin branch", async () => {
            vi.mocked(employeesAdmin).mockResolvedValue(employeeResult as any);

            const result = await service.employee(
                "admin",
                2,
                1,
                "Ana",
                "admin",
                "10"
            );

            expect(employeesAdmin).toHaveBeenCalledWith(
                2,
                "%Ana%"
            );

            expect(employeesOwner).not.toHaveBeenCalled();
            expect(result).toEqual(employeeResult);
        });

        it("should use the default name filter when no name is provided", async () => {
            vi.mocked(employeesAdmin).mockResolvedValue(employeeResult as any);

            const result = await service.employee(
                "admin",
                2,
                1,
                undefined,
                undefined,
                undefined
            );

            expect(employeesAdmin).toHaveBeenCalledWith(2, "%");
            expect(result).toEqual(employeeResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(employeesAdmin).mockRejectedValue(error);

            await expect(
                service.employee(
                    "admin",
                    2,
                    1,
                    "Ana",
                    undefined,
                    undefined
                )
            ).rejects.toBe(error);
        });
    });

    it("should not query repositories for an unsupported role", async () => {
        const result = await service.employee(
            "cashier",
            4,
            1,
            undefined,
            undefined,
            undefined
        );

        expect(result).toBeUndefined();
        expect(employeesOwner).not.toHaveBeenCalled();
        expect(employeesAdmin).not.toHaveBeenCalled();
    });
});