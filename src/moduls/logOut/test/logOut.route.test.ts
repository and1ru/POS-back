import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Route POST /logOut", () => {
    it("should logout successfully and clear the token cookie", async () => {
        const response = await request(app)
            .post("/logOut")
            .set("Cookie", "token=existing-token");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "log out successed",
            success: true
        });

        const cookies = response.headers["set-cookie"] as
            | string[]
            | undefined;

        expect(cookies).toBeDefined();

        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringMatching(/^token=;/)
            ])
        );
    });

    it("should logout successfully even if there is no token cookie", async () => {
        const response = await request(app)
            .post("/logOut");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "log out successed",
            success: true
        });

        const cookies = response.headers["set-cookie"] as
            | string[]
            | undefined;

        expect(cookies).toBeDefined();

        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringMatching(/^token=;/)
            ])
        );
    });
});