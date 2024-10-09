import db from '../db/db.mjs';
import Ticket from '../components/ticket.mjs';
import Service from '../components/service.mjs';

export default function ServiceDao(){
    
    this.getServices = () => {
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

    this.newTicket = (serviceName) => {
        return new Promise((resolve, reject) => {
            const selectQuery = 'SELECT * FROM Service WHERE name=?';
            db.get(selectQuery, [serviceName], (err, row) => {
                if (err) {
                    reject(new Error("Service not found"));  // Se c'è un errore, rigetta la Promise
                } else {
                    let ticketNumber = row.currentCustomer + 1;  // Incrementa il numero del cliente
                    const ticket = new Ticket(ticketNumber, serviceName);  // Crea il nuovo biglietto
                    
                    // Aggiorna il numero corrente di clienti e la lunghezza della coda nel DB
                    const updateQuery = 'UPDATE Service SET queueLen=? WHERE name=?';
                    const newQueueLen = row.queueLen + 1;  // Incrementa la lunghezza della coda
                    db.run(updateQuery, [newQueueLen, serviceName], (err) => {
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
    
    this.addService = (name, serviceTime) => {
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
    
this.callNextCustomer = (counterId) => {
    return new Promise((resolve, reject) => {

        const counterQuery = 'SELECT * FROM Counter WHERE id = ?';
        db.get(counterQuery, [counterId], (err, counter) => {
            if (err || !counter) {
                return reject(new Error("Counter not found"));
            }

            const servicesQuery = 'SELECT * FROM Service WHERE name IN (SELECT serviceName FROM CounterService WHERE counterId = ?)';
            db.all(servicesQuery, [counterId], (err, services) => {
                if (err) {
                    return reject(new Error("Error fetching services for counter"));
                }

                let selectedService = null;
                let maxQueueLength = -1;
                let minServiceTime = Infinity;

                for (const service of services) {
                    const queueLength = service.queueLen;
                    if (queueLength > maxQueueLength || 
                        (queueLength === maxQueueLength && service.serviceTime < minServiceTime)) {
                        maxQueueLength = queueLength;
                        minServiceTime = service.serviceTime;
                        selectedService = service;
                    }
                }

                if (!selectedService) {
                    return resolve({ error: 'No customers in queue for the services handled by this counter' });
                }

                const nextCustomerNumber = selectedService.currentCustomer; 
                const updateQueueQuery = 'UPDATE Service SET currentCustomer = currentCustomer - 1, currentQueueLength = currentQueueLength - 1 WHERE id = ?';
                
                db.run(updateQueueQuery, [selectedService.id], (err) => {
                    if (err) {
                        return reject(new Error("Error updating service queue"));
                    }
                    
                    resolve(`Now serving customer ${nextCustomerNumber} at Counter ${counterId} for service ${selectedService.name}`);
                });
            });
        });
    });
};

    
}