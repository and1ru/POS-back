import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../../helper/pool";
import { loginRepository } from "../login.repository";

vi.mock("../../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository loginRepository POST /login", () => {
    const userResult = {
        id: 1,
        name: "User One",
        email: "user@test.com",
        password: "hashed-password",
        role: "owner",
        company_id: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should get a user by email successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[userResult]] as any);

        const result = await loginRepository("user@test.com");

        expect(myDb.query).toHaveBeenCalledWith(
            "select * from users where email=?",
            ["user@test.com"]
        );

        expect(result).toEqual(userResult);
    });

    it("should return undefined if the user does not exist", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[]] as any);

        const result = await loginRepository("unknown@test.com");

        expect(result).toBeUndefined();
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            loginRepository("user@test.com")
        ).rejects.toBe(error);
    });
});