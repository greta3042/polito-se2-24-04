import { describe, test, expect, jest, afterEach } from "@jest/globals";
import db from "../../db/db.mjs"

// import the dao
import ServiceDao from "../../dao/service.mjs"
import Service from "../../components/service.mjs"
import Counter from "../../components/counter.mjs"

const service = new ServiceDao();

afterEach(()=>{
    jest.restoreAllMocks()
})

describe("GET newTicket", () => {
    test("Successfully got a new ticket", async () => {
        const ticket = {"ticketNumber": 1,"ticketService": "TestService"};
        const spyGet = jest.spyOn(db, 'get')
            .mockImplementation((sql, params, callback) => {
                return callback(null, {name: "TestService", serviceTime: 15, currentCustomer:  0, queueLen: 0});
            });
        const spyRun = jest.spyOn(db, 'run')
            .mockImplementation((sql, params, callback) => {
                return callback(null);
            });
        const result = await service.newTicket("TestService");
        expect(result).toEqual(ticket);
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
        const nextCustomer = {nextCustomerNumber: 2, counterId: counterNumber, serviceName: "TestService1", newQueueLength: 2,};
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

    test("Counter not found", async () => {
        jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            return callback(new Error("Counter not found"));
        });

        await expect(service.callNextCustomer(99)).rejects.toThrow("Counter not found");
    });

    test("Error fetching services for counter", async () => {
        const counterId = 1;
        jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            return callback(null, { id: counterId });
        });

        jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            return callback(new Error("Error fetching services for counter"));
        });

        await expect(service.callNextCustomer(counterId)).rejects.toThrow("Error fetching services for counter");
    });
    
    test("Error updating service queue", async () => {
        const counterId = 1;
        const mockServices = [
            { name: "TestService1", queueLen: 5, serviceTime: 15, currentCustomer: 1 }
        ];

        jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            return callback(null, { id: counterId });
        });

        jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
            return callback(null, mockServices);
        });

        jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
            return callback(new Error("Error updating service queue"));
        });

        await expect(service.callNextCustomer(counterId)).rejects.toThrow("Error updating service queue");
    });

    test("No customers in queue for the services handled by counter", async () => {
        const counterId = 1;
    
        const spyGetCounter = jest.spyOn(db, 'get')
            .mockImplementation((query, params, callback) => {
                if (query.includes('SELECT * FROM Counter')) {
                    return callback(null, { id: counterId, name: 'Counter1' });
                }
            });
    
        const spyGetCounterServices = jest.spyOn(db, 'all')
            .mockImplementation((query, params, callback) => {
                if (query.includes('SELECT * FROM Service')) {

                    return callback(null, [
                        { name: 'TestService1', queueLen: 0, serviceTime: 15, currentCustomer: 1 },
                        { name: 'TestService2', queueLen: 0, serviceTime: 10, currentCustomer: 2 }
                    ]);
                }
            });
    
        const service = new ServiceDao();
        const result = await service.callNextCustomer(counterId);
    
        expect(result).toEqual({ error: 'No customers in queue for the services handled by this counter' });
        
        spyGetCounter.mockRestore();
        spyGetCounterServices.mockRestore();
    });    

});


describe("getCounters", () => {
    test("Successfully retrieves a list of counters", async () => {
        const mockRows = [
            { id: 1, service: 'ServiceA' },
            { id: 2, service: 'ServiceB' }
        ];

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, mockRows);
        });

        const counters = await service.getCounters(); 
        expect(counters).toEqual([
            new Counter(1, 'ServiceA'),
            new Counter(2, 'ServiceB')
        ]);
    });

    test("No counters found", async () => {
        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(null, []); 
        });

        await expect(service.getCounters()).rejects.toThrow("No counter found");
    });

    test("Database error occurs", async () => {
        const dbError = new Error("Database error");

        jest.spyOn(db, 'all').mockImplementation((query, callback) => {
            callback(dbError, null);
        });

        await expect(service.getCounters()).rejects.toThrow("No counter found");
    });

});