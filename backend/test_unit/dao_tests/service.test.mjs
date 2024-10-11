import { describe, test, expect, jest, afterEach } from "@jest/globals";
import db from "../../db/db.mjs"

// import the dao
import ServiceDao from "../../dao/service.mjs"
import Service from "../../components/service.mjs"
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
        const spyRun = jest.spyOn(db, 'run')
            .mockImplementation((sql, params, callback) => {
                return callback(null);
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

    test("Error updating service queue length", async () => {
        const spyGet = jest.spyOn(db, 'get')
            .mockImplementation((sql, params, callback) => {
                return callback(null, {name: "TestService", serviceTime: 15, currentCustomer:  0, queueLen: 0});
            });
            
        const spyRun = jest.spyOn(db, 'run')
            .mockImplementation((sql, params, callback) => {
                return callback(new Error("Error updating service queue length"));
            });
            
        await expect(service.newTicket("Not existing service")).rejects.toThrow(Error);
    });
});

describe("GET services", () => {
    test("Successfully got services", async () => {
        const service1 = new Service("TestService1",15);
        const service2 = new Service("TestService2",30);
        const services = [service1, service2];
        const spyAll = jest.spyOn(db, 'all')
            .mockImplementation((sql, callback) => {
                return callback(null, [{name: "TestService1", serviceTime: 15}, {name: "TestService2", serviceTime: 30}]);
            });
        const result = await service.getServices();
        expect(result).toEqual(services);
    });

    test("Service not found", async () => {
        const spyAll = jest.spyOn(db, 'all')
            .mockImplementation((sql, callback) => {
                return callback(new Error("Service not found"));
            });
            
        await expect(service.getServices("Not existing service")).rejects.toThrow(Error);
    });

    test("No available service", async () => {
        const errObj = {error: 'No available service.'};
        const spyAll = jest.spyOn(db, 'all')
            .mockImplementation((sql, callback) => {
                return callback(null, []);
            });
            
        const result = await service.getServices();
        expect(result).toEqual(errObj);
    });
});

describe("callNextCustomer", () => {
    test("Successfully call next customer", async () => {
        const counterNumber = 1;
        const nextCustomer = {nextCustomerNumber: 2, counterId: counterNumber, serviceName: "TestService1"};
        const spyGet = jest.spyOn(db, 'get')
            .mockImplementation((sql, params, callback) => {
                return callback(null, {id: 1});
            });
        const spyAll = jest.spyOn(db, 'all')
            .mockImplementation((sql, params, callback) => {
                return callback(null, [{name: "TestService1", serviceTime: 15, currentCustomer: 1, queueLen: 3}, {name: "TestService2", serviceTime: 20, currentCustomer: 2, queueLen: 2}]);
            });
        const spyRun = jest.spyOn(db, 'run')
            .mockImplementation((sql, params, callback) => {
                return callback(null);
            });
        const result = await service.callNextCustomer(counterNumber);
        expect(result).toEqual(nextCustomer);
    });
});