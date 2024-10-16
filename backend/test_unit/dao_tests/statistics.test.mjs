import { describe, test, expect, jest, afterEach } from "@jest/globals";
import db from "../../db/db.mjs";
import ServiceDao from "../../dao/service.mjs";

const service = new ServiceDao();

afterEach(() => {
    jest.restoreAllMocks();
});

describe("GET getCustomersForEachCounter", () => {

    test("Successfully retrieves customers for each counter", async () => {
        const mockRows = [
            { idCounter: 1, numCustomers: 10 },
            { idCounter: 2, numCustomers: 15 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await service.getCustomersForEachCounter();
        expect(result).toEqual(mockRows);
    });

    test("No stats for any counter", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(service.getCustomersForEachCounter()).rejects.toThrow("No stats for any counter");
    });

    test("Error accessing the Stat table", async () => {
        const dbError = new Error("Error accessing the Stat table");

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(dbError, null);
        });

        await expect(service.getCustomersForEachCounter()).rejects.toThrow("Error accessing the Stat table");
    });

});