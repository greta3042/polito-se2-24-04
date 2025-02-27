import { describe, test, expect, jest, afterEach } from "@jest/globals";
import request from "supertest";
import { server } from "../../server.mjs"; // Assuming the server is exported from here
import StatisticDao from "../../dao/statistics.mjs"; // Import the DAO for statistics
import dayjs from "dayjs";

const baseURL = "/api/";
const statisticDao = new StatisticDao();

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(() => {
    server.close();
});

describe("GET /api/getDailyCustomersForEachCounterByService", () => {
    test("Successfully got daily customers for each counter by service", async () => {
        const dailyStats = [
            {
                counterId: 1,
                serviceType: 'Shipping',
                customerCount: 20,
            },
            {
                counterId: 2,
                serviceType: 'Smart card',
                customerCount: 15,
            },
        ];

        const spyDao = jest.spyOn(StatisticDao.prototype, "getDailyCustomersForEachCounterByService")
            .mockResolvedValueOnce(dailyStats);
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}getDailyCustomersForEachCounterByService`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(dailyStats);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("No daily stats available - error 404", async () => {
        const errorMessage = "No daily stats";
        const spyDao = jest.spyOn(StatisticDao.prototype, "getDailyCustomersForEachCounterByService")
            .mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}getDailyCustomersForEachCounterByService`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: errorMessage });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("Internal server error - error 500", async () => {
        const errorMessage = "Database connection failed";
        const spyDao = jest.spyOn(StatisticDao.prototype, "getDailyCustomersForEachCounterByService")
            .mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}getDailyCustomersForEachCounterByService`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal server error" });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
});

describe("GET /api/getWeeklyCustomersForEachCounterByService", () => {
    test("Successfully got weekly customers for each counter by service", async () => {
        const weeklyStats = [
            {
                counterId: 1,
                serviceType: 'Shipping',
                customerCount: 140,
            },
            {
                counterId: 2,
                serviceType: 'Smart card',
                customerCount: 105,
            },
        ];

        const spyDao = jest.spyOn(StatisticDao.prototype, "getWeeklyCustomersForEachCounterByService")
            .mockResolvedValueOnce(weeklyStats);
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}getWeeklyCustomersForEachCounterByService`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(weeklyStats);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("No weekly stats available - error 404", async () => {
        const errorMessage = "No weekly stats";
        const spyDao = jest.spyOn(StatisticDao.prototype, "getWeeklyCustomersForEachCounterByService")
            .mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}getWeeklyCustomersForEachCounterByService`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: errorMessage });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("Internal server error - error 500", async () => {
        const errorMessage = "Database connection failed";
        const spyDao = jest.spyOn(StatisticDao.prototype, "getWeeklyCustomersForEachCounterByService")
            .mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });

        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}getWeeklyCustomersForEachCounterByService`);
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal server error" });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
});

describe("GET /api/statistics/customersForServiceByDay", () => {
    test("Successfully got daily customers for each service", async () => {
        const mockDate = dayjs().format('YYYY-MM-DD');
        const dailyStats = [
            {
                date: mockDate,
                serviceName: 'Shipping',
                totalCustomers: 20,
            },
            {
                date: mockDate,
                serviceName: 'Smart card',
                totalCustomers: 15,
            },
        ];

        const spyDao = jest.spyOn(StatisticDao.prototype, "getCustomersForServiceByDay")
            .mockResolvedValueOnce(dailyStats);
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}statistics/customersForServiceByDay`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(dailyStats);
        expect(spyDao).toHaveBeenCalledTimes(1);
        
    });

    test("Internal server error - error 500", async () => {
        const spyDao = jest.spyOn(StatisticDao.prototype, "getCustomersForServiceByDay")
                        .mockRejectedValueOnce(new Error());

        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}statistics/customersForServiceByDay`);
        
        expect(response.status).toBe(500);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
});

describe("GET /api/statistics/customersForServiceByWeek", () => {
    test("Successfully got weekly customers for each service", async () => {
        const weeklyStats = [
            { week: '42', serviceName: "Shipping", totalCustomers: 10 },
            { week: '42', serviceName: "Smart card", totalCustomers: 15 }
        ];

        const spyDao = jest.spyOn(StatisticDao.prototype, "getCustomersForServiceByWeek")
            .mockResolvedValueOnce(weeklyStats);
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}statistics/customersForServiceByWeek`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(weeklyStats);
        expect(spyDao).toHaveBeenCalledTimes(1);
        
    });

    test("Internal server error - error 500", async () => {
        const spyDao = jest.spyOn(StatisticDao.prototype, "getCustomersForServiceByWeek")
                        .mockRejectedValueOnce(new Error());

        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}statistics/customersForServiceByWeek`);
        
        expect(response.status).toBe(500);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
});

describe("GET /api/statistics/customersForServiceByMonth", () => {
    test("Successfully got monthly customers for each service", async () => {
        const mockMonth = dayjs().format('YYYY-MM'); // Ottieni il mese attuale
        const monthlyStats = [
            { month: mockMonth, serviceName: "Shipping", totalCustomers: 20 },
            { month: mockMonth, serviceName: "Smart card", totalCustomers: 30 }
        ];

        const spyDao = jest.spyOn(StatisticDao.prototype, "getCustomersForServiceByMonth")
            .mockResolvedValueOnce(monthlyStats);
        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}statistics/customersForServiceByMonth`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(monthlyStats);
        expect(spyDao).toHaveBeenCalledTimes(1);
        
    });

    test("Internal server error - error 500", async () => {
        const spyDao = jest.spyOn(StatisticDao.prototype, "getCustomersForServiceByMonth")
                        .mockRejectedValueOnce(new Error());

        const { app } = await import('../../server'); 
        const response = await request(app).get(`${baseURL}statistics/customersForServiceByMonth`);
        
        expect(response.status).toBe(500);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
});