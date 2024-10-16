import { describe, test, expect, jest, afterEach } from "@jest/globals";
import db from "../../db/db.mjs";
import StatisticDao from "../../dao/statistics.mjs";
import dayjs from "dayjs";

const statDao = new StatisticDao();

afterEach(() => {
    jest.restoreAllMocks();
});

describe("GET getCustomersForEachCounterByDay", () => {

    test("Successfully retrieves customers for each counter", async () => {
        const mockRows = [
            { idCounter: 1, numCustomers: 10 },
            { idCounter: 2, numCustomers: 15 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await statDao.getCustomersForEachCounterByDay();
        expect(result).toEqual(mockRows);
    });

    test("No stats for any counter", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(statDao.getCustomersForEachCounterByDay()).rejects.toThrow("No stats for any counter");
    });

    test("Error accessing the Stat table", async () => {
        const dbError = new Error("Error accessing the Stat table");

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(dbError, null);
        });

        await expect(statDao.getCustomersForEachCounterByDay()).rejects.toThrow("Error accessing the Stat table");
    });

});

describe("GET getDailyCustomersForEachCounterByService", () => {

    test("Successfully retrieves daily customers for each counter by service", async () => {
        const mockDate = dayjs().format('YYYY-MM-DD');
        const mockRows = [
            { date: mockDate, counterId: 1, serviceName: "Shipping", totalCustomers: 10 },
            { date: mockDate, counterId: 2, serviceName: "Smart card", totalCustomers: 15 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await statDao.getDailyCustomersForEachCounterByService();
        expect(result).toEqual(mockRows);
    });

    test("No daily stats found for any counter and service", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(statDao.getDailyCustomersForEachCounterByService()).rejects.toThrow("No daily stats found for any counter and service.");
    });

    test("Error accessing the Stat table", async () => {
        const dbError = new Error("Database access error");

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(dbError, null);
        });

        await expect(statDao.getDailyCustomersForEachCounterByService()).rejects.toThrow("Error accessing the Stat table: Database access error");
    });
});