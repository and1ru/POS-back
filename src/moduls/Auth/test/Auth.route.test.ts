import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { generateTokenTest } from '../../../helper/generateTokenTest'
import { myDb } from '../../../helper/pool'
import { tokenTest } from '../../../helper/tokenTest'

describe("Route GET /auth", () => {
    beforeEach( async () => {
        await myDb.query(`
            START TRANSACTION;
            INSERT INTO companies (name, date) VALUES ("prueba", "2000-01-01");

            INSERT INTO users 
                (name, email, password, role, company_id) 
            VALUES ("Andres", "andres@gmail.com", "$2b$10$Tg0kQiI0/8MbOaT61PGVB.2ph.21rseE8R2FMrg45QJld5eT.ubAO", "owner", 1);
            COMMIT;
        `)
    })

    afterEach( async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE companies;
            TRUNCATE TABLE users;

            SET FOREIGN_KEY_CHECKS = 1;
        `)
    })

    it("authenticated successfully", async () => {
        const result = {
            branch_name: null,
            role: "owner",
            user_name: "Andres"
        }

        const response = await request(app)
            .get("/auth")
            .set("Cookie", generateTokenTest(1,"owner",1))

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ message: "authenticated", success: true, result })
    })

    it("service error, did not find user", async () => {
        const response = await request(app)
            .get("/auth")
            .set("Cookie", generateTokenTest(1, "owner", 2))

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: "did not find user", success: false})
    })

    tokenTest("/auth", "get")
})