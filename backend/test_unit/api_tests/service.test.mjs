import { describe, test, expect, jest, afterEach } from "@jest/globals";
import { server, socket } from "../../server.mjs";
import request from "supertest";
import db from "../../db/db.mjs";

// import the dao
import ServiceDao from "../../dao/service.mjs";
import Service from "../../components/service.mjs";
import Counter from "../../components/counter.mjs"

const service = new ServiceDao();

const PORT = 3001;
const PORT1 = 4001;

// define baseurl
const baseURL = "/api/";

afterEach(()=>{
    jest.restoreAllMocks();
})

afterAll(() => {
    server.close();
    socket.close();
});

describe("POST newTicket", () => {
    test("Successfully got a new ticket", async () => {
        const ticket = {ticket: {ticketNumber: "1", ticketService: "TestService"}};
        const spyDao = jest.spyOn(ServiceDao.prototype, "newTicket").mockResolvedValueOnce(ticket);

        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "newTicket").send({ serviceName: "TestService" });

        expect(response.status).toBe(200);
        expect(response.body.ticket).toEqual(ticket);
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

describe("GET services", () => {
    test("Successfully got services", async () => {
        const service1 = new Service("TestService1",15);
        const service2 = new Service("TestService2",30);
        const services = [service1, service2];
        const spyDao = jest.spyOn(ServiceDao.prototype, "getServices").mockResolvedValueOnce(services);

        const app = (await import("../../server")).app;
        const response = await request(app).get(baseURL + "services");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(services);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("Services not found - error 500", async () => {
        const spyDao = jest.spyOn(ServiceDao.prototype, "getServices").mockRejectedValueOnce(new Error());

        const app = (await import("../../server")).app;
        const response = await request(app).get(baseURL + "services");

        expect(response.status).toBe(500);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("No available service - error 404", async () => {
        const errorTest = {error: 'No available service.'};
        const spyDao = jest.spyOn(ServiceDao.prototype, "getServices").mockResolvedValueOnce(errorTest);

        const app = (await import("../../server")).app;
        const response = await request(app).get(baseURL + "services");

        expect(response.status).toBe(404);
    });
});

describe("POST callNextCustomer", () => {
    test("Successfully call next customer", async () => {
        const counterNumber = 1;
        const nextCustomer = {nextCustomerNumber: 2, counterId: counterNumber, serviceName: "TestService1", newQueueLength: 5};
        const spyDao = jest.spyOn(ServiceDao.prototype, "callNextCustomer").mockResolvedValueOnce(nextCustomer);

        const app = (await import("../../server")).app;
        const response = (await request(app).post(baseURL + "callNextCustomer").send({counterId: counterNumber}));
        expect(response.status).toBe(200);
        expect(response.body).toEqual(nextCustomer);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("No counters found - error 404", async () => {
        const counterNumber = 1;
        const errorMessage = { error: 'Counter not found' };

        const spyDao = jest.spyOn(ServiceDao.prototype, "callNextCustomer").mockRejectedValueOnce(new Error("Counter not found"));

        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "callNextCustomer").send({ counterId: counterNumber });
        
        expect(response.status).toBe(404);
        expect(response.body).toEqual(errorMessage);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("Error fetching services - error 500", async () => {
        const counterId = 1;
        const errorMessage = { error: 'Error fetching services for counter' };
        
        const spyDao = jest.spyOn(ServiceDao.prototype, "callNextCustomer").mockRejectedValueOnce(new Error("Error fetching services for counter"));
    
        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "callNextCustomer").send({ counterId });
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error fetching services for counter' });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("No customers in queue - error 404", async () => {
        const counterId = 1;
        const expectedResponse = { error: 'No customers in queue for the services handled by this counter' };
    
        const spyDao = jest.spyOn(ServiceDao.prototype, "callNextCustomer").mockResolvedValueOnce({ error: 'No customers in queue for the services handled by this counter' });
    
        const app = (await import("../../server")).app;
        const response = await request(app).post(baseURL + "callNextCustomer").send({ counterId });
        
        expect(response.status).toBe(404); 
        expect(response.body).toEqual(expectedResponse);
        expect(spyDao).toHaveBeenCalledTimes(1);
    });
    
});


describe("GET /api/counters", () => {
    test("Successfully retrieves a list of counters", async () => {
        const mockRows = [
            { id: 1, service: 'ServiceA' },
            { id: 2, service: 'ServiceB' },
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const app = (await import("../../server")).app; 
        const response = await request(app).get(baseURL + "counters");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            new Counter(1, 'ServiceA'), 
            new Counter(2, 'ServiceB')
        ]);
    });

    test("No counters found - error 404", async () => {
        const errorTest = new Error("No counter found");
        const spyDao = jest.spyOn(ServiceDao.prototype, "getCounters").mockRejectedValueOnce(errorTest);

        const app = (await import("../../server")).app;
        const response = await request(app).get(baseURL + "counters");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "No counter found" });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

    test("Database error - error 500", async () => {
        const spyDao = jest.spyOn(ServiceDao.prototype, "getCounters").mockRejectedValueOnce(new Error("Database error"));

        const app = (await import("../../server")).app;
        const response = await request(app).get(baseURL + "counters");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Internal server error" });
        expect(spyDao).toHaveBeenCalledTimes(1);
    });

});

describe('Server and Socket Initialization', () => {
    afterAll(() => {
        server.close();
        socket.close();
    });

    test('Server should start and listen on the correct port', async () => {
        const app = (await import("../../server")).app;
        const testServer = request(app);
        const response = await testServer.get('/');
        
        expect(response.status).toBe(404);
        console.log(`HTTP server is running on port ${PORT}`);
    });

    test('Socket server should start and listen on the correct port', async () => {
        const socketIoClient = require('socket.io-client');
        const client = socketIoClient(`http://localhost:${PORT1}`);

        await new Promise((resolve, reject) => {
            client.on('connect', () => {
                console.log(`Socket.io server is running on port ${PORT1}`);
                client.close();
                resolve();
            });

            client.on('connect_error', (err) => {
                reject(err); 
            });
        });
    });
});

describe('Error Handling', () => {
    let mockServer;
    let mockSocket;

    beforeEach(() => {
        mockServer = jest.spyOn(server, 'listen');
        mockSocket = jest.spyOn(socket, 'listen');
    });

    afterEach(() => {
        mockServer.mockRestore();
        mockSocket.mockRestore();
    });

    test('Server should throw error if port is already in use', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockServer.mockImplementation((port, callback) => {
            const error = new Error('EADDRINUSE: address already in use');
            error.code = 'EADDRINUSE';
            throw error;
        });

        try {
            await expect(() => server.listen(PORT)).toThrow('EADDRINUSE');
        } catch (error) {
            expect(errorSpy).toHaveBeenCalled();
        }

        errorSpy.mockRestore();
    });

    test('Socket should throw error if port is already in use', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockSocket.mockImplementation((port, callback) => {
            const error = new Error('EADDRINUSE: address already in use');
            error.code = 'EADDRINUSE';
            throw error;
        });

        try {
            await expect(() => socket.listen(PORT1)).toThrow('EADDRINUSE');
        } catch (error) {
            expect(errorSpy).toHaveBeenCalled();
        }

        errorSpy.mockRestore();
    });
});
