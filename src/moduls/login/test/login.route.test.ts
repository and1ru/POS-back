import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";
import { myDb } from "../../helper/pool";
import { hashPassword } from "../../helper/hashPassword";

describe("Route POST /login", () => {
    const email = "user@test.com";
    const password = "Password123!";

    let hashedPassword: string;

    beforeEach(async () => {
        hashedPassword = await hashPassword(password);

        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (id, name, date)
            VALUES (1, 'Company One', '2026-11-05');

            INSERT INTO users (id, name, email, password, role, company_id)
            VALUES (1, 'User One', ?, ?, 'owner', 1);

            COMMIT;
        `, [email, hashedPassword]);
    });

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE users;
            TRUNCATE TABLE companies;

            SET FOREIGN_KEY_CHECKS = 1;
        `);
    });

    describe("successful requests", () => {
        it("should login successfully and return the token in a cookie", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    email,
                    password
                });

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                message: "se inicio sesion",
                success: true
            });

            const cookies = response.headers["set-cookie"] as
                | string[]
                | undefined;

            expect(
                cookies?.some((cookie) => /^token=.+/.test(cookie))
            ).toBe(true);
        });
    });

    describe("invalid credentials", () => {
        it("should return 400 if the user does not exist", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    email: "unknown@test.com",
                    password
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "no existe usuario con ese email"
            );

            expect(response.headers["set-cookie"]).toBeUndefined();
        });

        it("should return 400 if the password is incorrect", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    email,
                    password: "WrongPassword123!"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "contraseñas no coinciden"
            );

            expect(response.headers["set-cookie"]).toBeUndefined();
        });
    });
});