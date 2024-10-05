import { describe, test, expect, jest, afterEach } from "@jest/globals";
import db from "../../db/db.mjs"

// import the dao
import ServiceDao from "../../dao/service.mjs"

const service = new ServiceDao();

afterEach(()=>{
    jest.restoreAllMocks()
})

describe("GET newTicket", () => {
    test("Successfully got a new ticket", async () => {
        const ticket = "1 TestService";
        const spyGet = jest.spyOn(db, 'get')
            .mockImplementation((sql, params, callback) => {
                return callback(null, {name: "TestService", serviceTime: 15, currentCustomer:  0, queueLen: 0});
            });

        const result = await service.newTicket("TestService");
        expect(result).toBe(ticket);
    });

    test("Service not found", async () => {
        const spyGet = jest.spyOn(db, 'get')
            .mockImplementation((sql, params, callback) => {
                return callback(new Error("Service not found"));
            });
            
        await expect(service.newTicket("Not existing service")).rejects.toThrow(Error);
    });
});