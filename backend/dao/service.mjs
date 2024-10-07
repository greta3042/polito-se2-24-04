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
                    if(!rows) {
                        resolve({error: 'No avaiable service.'});
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
    
}