import { describe, test, expect, jest, afterEach } from "@jest/globals";
import request from "supertest";
import { server } from "../../server.mjs"; // Assuming the server is exported from here
import StatisticDao from "../../dao/statistics.mjs"; // Import the DAO for statistics

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