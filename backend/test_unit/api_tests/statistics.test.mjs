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
    test("Successfully retrieves daily customers for each counter by service", async () => {
        const mockStats = [
            { counterId: 1, serviceName: "Shipping", customerCount: 10 },
            { counterId: 2, serviceName: "Smart card", customerCount: 15 },
        ];
        
        const spyDao = jest.spyOn(statisticDao, "getDailyCustomersForEachCounterByService").mockResolvedValueOnce(mockStats);

        const app = (await import("../../server")).app; // Import the app
        const response = await request(app).get(baseURL + "getDailyCustomersForEachCounterByService");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStats);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("No daily stats found - error 404", async () => {
        const spyDao = jest.spyOn(statisticDao, "getDailyCustomersForEachCounterByService").mockRejectedValueOnce(new Error("No daily stats"));

        const app = (await import("../../server")).app; 
        const response = await request(app).get(baseURL + "getDailyCustomersForEachCounterByService");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "No daily stats" });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("Database error - error 500", async () => {
        const spyDao = jest.spyOn(statisticDao, "getDailyCustomersForEachCounterByService").mockRejectedValueOnce(new Error("Database error"));

        const app = (await import("../../server")).app; 
        const response = await request(app).get(baseURL + "getDailyCustomersForEachCounterByService");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal server error" });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
});