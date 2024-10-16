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

describe("GET getCustomersForServiceByDay", () => {

    test("Successfully retrieves daily customers for each service", async () => {
        const mockDate = dayjs().format('YYYY-MM-DD');
        const mockRows = [
            { date: mockDate, serviceName: "Shipping", totalCustomers: 10 },
            { date: mockDate, serviceName: "Smart card", totalCustomers: 15 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await statDao.getCustomersForServiceByDay();
        expect(result).toEqual(mockRows);
    });

    test("No daily stats found for any service", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(statDao.getCustomersForServiceByDay()).rejects.toThrow(Error);
    });

    test("Error accessing the Stat table", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(new Error(), null);
        });

        await expect(statDao.getCustomersForServiceByDay()).rejects.toThrow(Error);
    });

});

describe("GET getCustomersForServiceByWeek", () => {

    test("Successfully retrieves weekly customers for each service", async () => {
        const mockRows = [
            { week: '42', serviceName: "Shipping", totalCustomers: 10 },
            { week: '42', serviceName: "Smart card", totalCustomers: 15 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await statDao.getCustomersForServiceByWeek();
        expect(result).toEqual(mockRows);
    });

    test("No weekly stats found for any service", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(statDao.getCustomersForServiceByWeek()).rejects.toThrow(Error);
    });

    test("Error accessing the Stat table", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(new Error(), null);
        });

        await expect(statDao.getCustomersForServiceByWeek()).rejects.toThrow(Error);
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

describe("GET getWeeklyCustomersForEachCounterByService", () => {

    test("Successfully retrieves weekly customers for each counter by service", async () => {
        const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
        const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD');
        const mockRows = [
            { date: weekStart, week: '42', counterId: 1, serviceName: "Shipping", totalCustomers: 10 },
            { date: weekStart, week: '42', counterId: 2, serviceName: "Smart card", totalCustomers: 15 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await statDao.getWeeklyCustomersForEachCounterByService();
        expect(result).toEqual(mockRows);
    });

    test("No weekly stats found for any counter and service", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(statDao.getWeeklyCustomersForEachCounterByService()).rejects.toThrow("No weekly stats found for any counter and service.");
    });

    test("Error accessing the Stat table", async () => {
        const dbError = new Error("Database access error");

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(dbError, null);
        });

        await expect(statDao.getWeeklyCustomersForEachCounterByService()).rejects.toThrow("Error accessing the Stat table: Database access error");
    });
});

describe("GET getMonthlyCustomersForEachCounterByService", () => {

    test("Successfully retrieves monthly customers for each counter by service", async () => {
        const mockMonth = dayjs().format('YYYY-MM'); // Ottieni il mese attuale
        const mockRows = [
            { month: mockMonth, counterId: 1, serviceName: "Shipping", totalCustomers: 20 },
            { month: mockMonth, counterId: 2, serviceName: "Smart card", totalCustomers: 30 }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const result = await statDao.getMonthlyCustomersForEachCounterByService();
        expect(result).toEqual(mockRows);
    });

    test("No monthly stats found for any counter and service", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []);  // Nessun risultato
        });

        await expect(statDao.getMonthlyCustomersForEachCounterByService()).rejects.toThrow("No monthly stats found for any counter and service.");
    });

    test("Error accessing the Stat table", async () => {
        const dbError = new Error("Database access error");

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(dbError, null);
        });

        await expect(statDao.getMonthlyCustomersForEachCounterByService()).rejects.toThrow("Error accessing the Stat table: Database access error");
    });
});