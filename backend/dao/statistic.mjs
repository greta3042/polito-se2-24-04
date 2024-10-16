import db from '../db/db.mjs';
import dayjs from 'dayjs';

export default class StatisticDao{
    getCustomersForEachCounter() {
        return new Promise((resolve, reject) => {
            const query = `SELECT idCounter, SUM(numCustomers) AS numCustomers
                            FROM Stat
                            GROUP BY idCounter`
            db.all(query,(err, rows) => {
                if(err)
                    reject(new Error("Error accessing the Stat table"));
                if(rows.length === 0)
                    reject(new Error("No stats for any counter"));
                resolve(rows);
            });
        });
    }

    
    getCustomersForEachCounterByService() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT cs.counterId, s.name AS serviceName, SUM(st.numCustomers) AS numCustomers
                FROM Stat st
                JOIN CounterService cs ON st.nameService = cs.serviceName
                JOIN Service s ON cs.serviceName = s.name
                GROUP BY cs.counterId, s.name
                ORDER BY cs.counterId, s.name
            `;
    
            db.all(query, (err, rows) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(new Error("Error accessing the Stat table: " + err.message));
                }
                if (!rows || rows.length === 0) {
                    return reject(new Error("No stats found for any counter and service."));
                }
                resolve(rows);
            });
        });
    }  

    getOverallStats(period){
        return new Promise ((resolve, reject) => {
            let dateCondition = '';
            const today = dayjs();
    
            if (period === 'daily') {
                const date = today.format('YYYY-MM-DD');
                dateCondition = `WHERE date = '${date}'`;  
            } else if (period === 'weekly') {
                const weekStart = today.startOf('week').format('YYYY-MM-DD');
                const weekEnd = today.endOf('week').format('YYYY-MM-DD');  
                dateCondition = `WHERE date BETWEEN '${weekStart}' AND '${weekEnd}'`;
            } else {
                return reject(new Error("Invalid period. Use 'daily' or 'weekly'."));
            }
    
            const query = `
                SELECT date, nameService, SUM(numCustomers) AS numCustomers
                FROM Stat
                ${dateCondition}
                GROUP BY date, nameService
                ORDER BY nameService, date
            `;

            db.all(query, (err, rows) => {
                if(err)
                    reject(new Error("Error accessing the Stat table"));
                if(rows.length === 0)
                    reject(new Error("No stats found for the given period"));
                resolve(rows);
            });
        })
    }    
}