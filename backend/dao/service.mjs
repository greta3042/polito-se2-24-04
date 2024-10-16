import db from '../db/db.mjs';
import Ticket from '../components/ticket.mjs';
import Service from '../components/service.mjs';
import Counter from '../components/counter.mjs';
import dayjs from 'dayjs';

export default class ServiceDao{
    
    getServices(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT name, serviceTime FROM Service';
            db.all(query, (err, rows) => {
                if(err) {
                    reject(err);  // Se c'è un errore, rigetta la Promise
                } else {
                    if(!rows || rows.length === 0) {
                        resolve({error: 'No available service.'});
                    } else {
                        let services = rows.map((s) => new Service(s.name, s.serviceTime));
                        resolve(services);
                    }
                }
            });
        });
    };

    newTicket(serviceName){
        return new Promise((resolve, reject) => {
            const selectQuery = 'SELECT * FROM Service WHERE name=?';

            db.get(selectQuery, [serviceName], (err, row) => {
                if (err) {
                    reject(new Error("Service not found"));  // Se c'è un errore, rigetta la Promise
                } else {
                    let ticketNumber = row.queueLen + 1;  // Incrementa il numero del cliente
                    const ticket = new Ticket(ticketNumber, serviceName);  // Crea il nuovo biglietto

                    // Aggiorna il numero corrente di clienti e la lunghezza della coda nel DB
                    const updateQuery = 'UPDATE Service SET queueLen = ? WHERE name = ?';

                    db.run(updateQuery, [ticketNumber, serviceName], (err) => {
                        if (err) {
                            reject(new Error("Error updating service queue length"));  // Gestisci l'errore
                        } else {
                            resolve(`${ticket.code} ${ticket.serviceName}`);  // Risolvi la Promise con il ticket
                        }
                    });
                }
            });
        });
    }; 
    
    addService(name, serviceTime){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Service (name, serviceTime) VALUES (?, ?)';
            
            db.run(query, [name, serviceTime], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID); 
            });
        });
    };

    getCounters() {
        return new Promise((resolve, reject) => {
            const counterQuery = 'SELECT * FROM Counter';
            db.all(counterQuery, (err, rows) => {
                if(err || !rows || rows.length === 0){
                    return reject(new Error("No counter found"));
                }else{
                    let counters = rows.map((c) => new Counter(c.id, c.service));
                    resolve(counters);
                }
            })
        })
    }

    callNextCustomer(counterId) {
        return new Promise((resolve, reject) => {
            const counterQuery = 'SELECT * FROM Counter WHERE id = ?';
            db.get(counterQuery, [counterId], (err, counter) => {
                if (err || !counter) {
                    return reject(new Error("Counter not found"));
                }
    
                const servicesQuery = `
                    SELECT * FROM Service 
                    WHERE name IN (
                        SELECT serviceName FROM CounterService WHERE counterId = ?
                    )`;
                db.all(servicesQuery, [counterId], (err, services) => {
                    if (err || services.length === 0) {
                        return reject(new Error("Error fetching services for counter"));
                    }
    
                    let selectedService = null;
                    let maxQueueLength = 0;
                    let minServiceTime = Infinity;
    
                    for (const service of services) {
                        const queueLength = service.queueLen;
                        const serviceTime = service.serviceTime;
    
                        if (queueLength > 0) {
                            if (queueLength > maxQueueLength || 
                                (queueLength === maxQueueLength && serviceTime < minServiceTime)) {
                                maxQueueLength = queueLength;
                                minServiceTime = serviceTime;
                                selectedService = service;
                            }
                        }
                    }
    
                    if (!selectedService) {
                        return resolve({ error: 'No customers in queue for the services handled by this counter' }); 
                    }
    
                    const nextCustomerNumber = selectedService.currentCustomer + 1;
                    const currentQueueLength = selectedService.queueLen;
                    const updateQueueQuery = `
                        UPDATE Service 
                        SET currentCustomer = currentCustomer + 1, queueLen = queueLen - 1 
                        WHERE name = ?`;
    
                    db.run(updateQueueQuery, [selectedService.name], (err) => {
                        if (err) {
                            return reject(new Error("Error updating service queue"));
                        }

                        const todayDate = dayjs();
                        const today = todayDate.format('YYYY-MM-DD');
                        const getStatQuery = `SELECT *
                                            FROM Stat
                                            WHERE idCounter = ? AND date = ? AND nameService = ?`
                        db.get(getStatQuery, [counterId, today, selectedService.name], (err, row) => {
                            if (err) {
                                return reject(new Error("Error accessing the Stat table"));
                            }
                            if(!row){
                                const insertStatQuery = `INSERT INTO Stat(idCounter, date, nameService, numCustomers)
                                                        VALUES (?, ?, ?, 1)`
                                db.run(insertStatQuery, [counterId, today, selectedService.name], (err) => {
                                    if (err) {
                                        return reject(new Error("Error accessing the Stat table"));
                                    }
                                });
                            }
                            else {
                                const updateStatQuery = `UPDATE Stat
                                                        SET numCustomers = numCustomers + 1
                                                        WHERE idCounter = ? AND date = ? AND nameService = ?`
                                db.run(updateStatQuery, [counterId, today, selectedService.name], (err) => {
                                    if (err) {
                                        return reject(new Error("Error accessing the Stat table"));
                                    }
                                });
                            }
                        });
                        
                        resolve({
                            nextCustomerNumber,
                            counterId,
                            serviceName: selectedService.name,
                            newQueueLength: currentQueueLength - 1,
                        });
                    });
                });
            });
        });
    }
    
    
    
}