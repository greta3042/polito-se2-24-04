import db from './db.mjs';
import Ticket from '../components/ticket.mjs';

export default function ServiceDao(){
    
    this.newTicket = (serviceName) => {
        const query = 'SELECT * FROM Service WHERE name=?';
        db.get(query, [serviceName], (err, row) => {
            if(err){
                reject(err); //creare un errore che indichi l'inesistenza del servizio selezionato
            }else{
                if(row.queueLen==0){
                    const ticket = new Ticket(1,serviceName);
                    resolve(""+ticket.code+" "+ticket.serviceName);
                }else{
                    const ticket = new Ticket(row.currentCustomer++, serviceName);
                    resolve(""+ticket.code+" "+ticket.serviceName);
                }
            }
        })
    }
}