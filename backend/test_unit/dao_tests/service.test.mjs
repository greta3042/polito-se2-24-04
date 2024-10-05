import { describe, test, expect, jest, afterEach } from "@jest/globals"
import db from "../db/db.mjs"

// import the dao
import ServiceDao from "../dao/ServiceDao"

const service = new ServiceDao();

afterEach(()=>{
    jest.restoreAllMocks()
})

describe("GET newTicket", () => {
    test("Successfully got a new ticket", async () => {
        const ticket = "1 shipping";
        const spyGet = jest.spyOn(db, 'get')
            .mockImplementation((sql, params, callback) => {
                return callback(null, {name: "shipping", serviceTime: 15, currentCustomer:  0, queueLen: 0});
            });

        const result = await service.newTicket("shipping");
        expect(result).toBe(ticket);
    });
});