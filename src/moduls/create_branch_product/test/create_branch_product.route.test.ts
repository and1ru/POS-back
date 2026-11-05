import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { generateTokenTest } from '../../../helper/generateTokenTest'
import { myDb } from '../../../helper/pool'
import { tokenTest } from '../../../helper/tokenTest'

describe("Route POST /branch-product", () => {
    const body = {
        minStock: 5,
        currentStock: 20,
        boughtPriceProduct: 100.50,
        sellPriceProduct: 150.75,
        productId: 1
    }

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (name, date)
            VALUES ("test name", "2000-01-01");

            INSERT INTO products (name, image_url, image_id, company_id)
            VALUES ("product test", "image test", "image id test", 1);

            INSERT INTO branches
                (name, address, city, company_id)
            VALUES
                ("test name", "test address", "test city", 1);

            COMMIT;
        `)
    })

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE companies;
            TRUNCATE TABLE branches;
            TRUNCATE TABLE products;

            SET FOREIGN_KEY_CHECKS = 1;
        `)
    })

    it("should return 201", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send(body)
        
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ message: "product created", success: true })
    })

    it("should return 403 with root", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body})
        
        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 403 with owner", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...body})
        
        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 403 with cashier", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "cashier", 1))
            .send({ ...body})
        
        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 400 when minStock is a string", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, minStock: "5" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when minStock is negative", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, minStock: -5 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when minStock is zero", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, minStock: 0 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when minStock is decimal", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, minStock: 5.5 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when currentStock is a string", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, currentStock: "20" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when currentStock is negative", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, currentStock: -20 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when currentStock is zero", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, currentStock: 0 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when currentStock is decimal", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, currentStock: 20.5 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when boughtPriceProduct is a string", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, boughtPriceProduct: "100.50" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when boughtPriceProduct is negative", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, boughtPriceProduct: -100.50 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when boughtPriceProduct is zero", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, boughtPriceProduct: 0 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when sellPriceProduct is a string", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, sellPriceProduct: "150.75" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when sellPriceProduct is negative", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, sellPriceProduct: -150.75 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when sellPriceProduct is zero", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, sellPriceProduct: 0 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when productId is a string", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, productId: "1" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when productId is negative", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, productId: -1 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when productId is zero", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, productId: 0 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when productId is decimal", async () => {
        const response = await request(app)
            .post("/branch-product")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({ ...body, productId: 1.5 })

        expect(response.status).toBe(400)
    })

    tokenTest("/branch-product", "post")
})