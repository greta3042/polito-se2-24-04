import db from '../db/db.mjs';
import Ticket from '../components/ticket.mjs';

export default function ServiceDao(){
    
    this.newTicket = (serviceName) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Service WHERE name=?';
            db.get(query, [serviceName], (err, row) => {
                if(err) {
                    reject(new Error("Service not found"));  // Se c'è un errore, rigetta la Promise
                } else {
                    if(row.queueLen === 0) {
                        const ticket = new Ticket(1, serviceName);
                        resolve(`${ticket.code} ${ticket.serviceName}`);  // Risolvi la Promise con il ticket
                    } else {
                        const ticket = new Ticket(row.currentCustomer++, serviceName);
                        resolve(`${ticket.code} ${ticket.serviceName}`);
                    }
                }
            });
        });
    };
    
}