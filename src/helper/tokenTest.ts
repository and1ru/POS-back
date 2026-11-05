import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

export const tokenTest = (url: string, method: "get" | "post" | "put" | "patch" | "delete") => {
    describe("token test", () => {
        it("should return 401 when there is no token", async () => {
            const response = await request(app)[method](url)

            expect(response.status).toBe(401)

            expect(response.body).toEqual({ message: "no token", success: false })
        })

        it("invalid token or expired", async () => {
            const response = await request(app)[method](url)
                .set("Cookie", [`token=invalid-token`])

            expect(response.status).toBe(401)
            expect(response.body).toEqual({ message: "invalid token", success: false })
        })
    })
}

