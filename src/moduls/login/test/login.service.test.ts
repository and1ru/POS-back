import { beforeEach, describe, expect, it, vi } from "vitest";
import { comparePassword } from "../../helper/comparePassword";
import { generateToken } from "../../helper/generateToken";
import { loginRepository } from "./login.repository";
import { LoginService } from "./login.service";

vi.mock("../../helper/comparePassword", () => ({
    comparePassword: vi.fn()
}));

vi.mock("../../helper/generateToken", () => ({
    generateToken: vi.fn()
}));

vi.mock("./login.repository", () => ({
    loginRepository: vi.fn()
}));

describe("Service login POST /login", () => {
    let service: LoginService;

    const email = "user@test.com";
    const password = "Password123!";
    const hashedPassword = "hashed-password";
    const token = "generated-jwt-token";

    const userResult = {
        id: 1,
        name: "User One",
        password: hashedPassword,
        role: "owner",
        company_id: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();

        service = new LoginService();
    });

    it("should login successfully and generate a token", async () => {
        vi.mocked(loginRepository).mockResolvedValue(userResult as any);
        vi.mocked(comparePassword).mockResolvedValue(true);
        vi.mocked(generateToken).mockReturnValue(token as any);

        const result = await service.login(email, password);

        expect(loginRepository).toHaveBeenCalledWith(email);

        expect(comparePassword).toHaveBeenCalledWith(
            password,
            hashedPassword
        );

        expect(generateToken).toHaveBeenCalledWith({
            userId: 1,
            role: "owner",
            companyId: 1
        });

        expect(result).toBe(token);
    });

    it("should throw an error if the user does not exist", async () => {
        vi.mocked(loginRepository).mockResolvedValue(undefined as any);

        await expect(
            service.login(email, password)
        ).rejects.toThrow("no existe usuario con ese email");

        expect(comparePassword).not.toHaveBeenCalled();
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should throw an error if the password does not match", async () => {
        vi.mocked(loginRepository).mockResolvedValue(userResult as any);
        vi.mocked(comparePassword).mockResolvedValue(false);

        await expect(
            service.login(email, password)
        ).rejects.toThrow("contraseñas no coinciden");

        expect(comparePassword).toHaveBeenCalledWith(
            password,
            hashedPassword
        );

        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
        const error = new Error("database error");

        vi.mocked(loginRepository).mockRejectedValue(error);

        await expect(
            service.login(email, password)
        ).rejects.toBe(error);

        expect(comparePassword).not.toHaveBeenCalled();
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should propagate password comparison errors", async () => {
        const error = new Error("password comparison error");

        vi.mocked(loginRepository).mockResolvedValue(userResult as any);
        vi.mocked(comparePassword).mockRejectedValue(error);

        await expect(
            service.login(email, password)
        ).rejects.toBe(error);

        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should propagate token generation errors", async () => {
        const error = new Error("token generation error");

        vi.mocked(loginRepository).mockResolvedValue(userResult as any);
        vi.mocked(comparePassword).mockResolvedValue(true);
        vi.mocked(generateToken).mockImplementation(() => {
            throw error;
        });

        await expect(
            service.login(email, password)
        ).rejects.toBe(error);
    });
});