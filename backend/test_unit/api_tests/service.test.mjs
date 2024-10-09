import { describe, test, expect, jest, afterEach } from "@jest/globals";
import request from "supertest";
import db from "../../db/db.mjs";

// import the dao
import ServiceDao from "../../dao/service.mjs";
import Service from "../../components/service.mjs";
const service = new ServiceDao();

// define baseurl
const baseURL = "/api/";
let server;

beforeAll(async () => {
    server = (await import("../../server")).server;
});

afterEach(()=>{
    jest.restoreAllMocks();
})

afterAll(() => {
    server.close();
});

describe("POST newTicket", () => {
    test("Successfully got a new ticket", async () => {
        const ticket = "1 TestService";
        const spyDao = jest.spyOn(ServiceDao.prototype, "newTicket").mockResolvedValueOnce(ticket);

        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "newTicket").send({ serviceName: "TestService" });

        expect(response.status).toBe(200);
        expect(response.body.ticket).toBe(ticket);
        expect(spyDao).toHaveBeenCalledTimes(1);
        expect(spyDao).toHaveBeenCalledWith(
            "TestService"
        );
    });

    test("Service not found - error 500", async () => {
        const spyDao = jest.spyOn(ServiceDao.prototype, "newTicket").mockRejectedValueOnce(new Error());

        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "newTicket").send({ serviceName: "TestService" });

        expect(response.status).toBe(500);
        expect(spyDao).toHaveBeenCalledTimes(1);
        expect(spyDao).toHaveBeenCalledWith(
            "TestService"
        );
    });

    test("Service not correct - error 404", async () => {
        const spyDao = jest.spyOn(ServiceDao.prototype, "newTicket").mockResolvedValueOnce();

        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "newTicket").send({ serviceName: "TestService" });

        expect(response.status).toBe(404);
        expect(spyDao).toHaveBeenCalledTimes(1);
        expect(spyDao).toHaveBeenCalledWith(
            "TestService"
        );
    });
});
