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
}