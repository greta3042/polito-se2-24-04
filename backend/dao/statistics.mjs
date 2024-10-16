import db from '../db/db.mjs';
import dayjs from 'dayjs';

export default class StatisticDao{
    getCustomersForEachCounterByDay() {
        return new Promise((resolve, reject) => {
            const query = `SELECT idCounter, date, SUM(numCustomers) AS numCustomers
                            FROM Stat
                            GROUP BY idCounter, date`;
            db.all(query,(err, rows) => {
                if(err)
                    reject(new Error("Error accessing the Stat table"));
                if(rows.length === 0)
                    reject(new Error("No stats for any counter"));
                resolve(rows);
            });
        });
    }

    getCustomersForEachCounterByWeek() {
        return new Promise((resolve, reject) => {
            const query = `SELECT idCounter, strftime('%Y-%W', date) AS week, SUM(numCustomers) AS numCustomers
                            FROM Stat
                            GROUP BY idCounter, week`;
            db.all(query,(err, rows) => {
                if(err)
                    reject(new Error("Error accessing the Stat table"));
                if(rows.length === 0)
                    reject(new Error("No stats for any counter"));
                resolve(rows);
            });
        });
    }

    getCustomersForEachCounterByMonth() {
        return new Promise((resolve, reject) => {
            const query = `SELECT idCounter, strftime('%Y-%m', date) AS month, SUM(numCustomers) AS numCustomers
                            FROM Stat
                            GROUP BY idCounter, month`;
            db.all(query,(err, rows) => {
                if(err)
                    reject(new Error("Error accessing the Stat table"));
                if(rows.length === 0)
                    reject(new Error("No stats for any counter"));
                resolve(rows);
            });
        });
    }
    
    // getCustomersForEachCounterByService() {
    //     return new Promise((resolve, reject) => {
    //         const query = `
    //             SELECT cs.counterId, s.name AS serviceName, SUM(st.numCustomers) AS numCustomers
    //             FROM Stat st
    //             JOIN CounterService cs ON st.nameService = cs.serviceName
    //             JOIN Service s ON cs.serviceName = s.name
    //             GROUP BY cs.counterId, s.name
    //             ORDER BY cs.counterId, s.name
    //         `;
    
    //         db.all(query, (err, rows) => {
    //             if (err) {
    //                 console.error("Database error:", err);
    //                 return reject(new Error("Error accessing the Stat table: " + err.message));
    //             }
    //             if (!rows || rows.length === 0) {
    //                 return reject(new Error("No stats found for any counter and service."));
    //             }
    //             resolve(rows);
    //         });
    //     });
    // }  
    

    /*getCustomersForServiceByDay(day) {
        return new Promise((resolve, reject) => {
            const statQuery = "SELECT date, nameService, SUM(numCustomers) AS totalCustomers FROM Stat WHERE date = ? GROUP BY date, nameService";
            
            db.all(statQuery, [day], (err, stats) => {
                if (err) {
                    return reject(new Error("Error retrieving stats"));
                } else {
                    stats.forEach(stat => {
                        console.log(`Date: ${stat.date}, Service: ${stat.nameService}, Total Customers: ${stat.totalCustomers}`);
                    });
                    resolve(stats);  
                }
            });
        });
    }*/

    getCustomersForServiceByDay() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT date, nameService, SUM(numCustomers) AS totalCustomers
                FROM Stat
                GROUP BY date, nameService
            `;
    
            db.all(query, (err, rows) => {
                if (err) {
                    return reject(new Error("Error accessing the Stat table"));
                }
                if (rows.length === 0) {
                    return reject(new Error("No stats for any service"));
                }
                
                resolve(rows);
            });
        });
    }


    /*getCustomersForServiceByWeek(week, year) {
        return new Promise((resolve, reject) => {
            // Format the week
            const weekStr = week.toString().padStart(2, '0');
            const yearStr = year.toString();
    
            const statQuery = `
                SELECT 
                    strftime('%W', date) AS week, 
                    strftime('%Y', date) AS year, 
                    nameService, 
                    SUM(numCustomers) AS totalCustomers 
                FROM Stat 
                WHERE strftime('%W', date) = ? 
                  AND strftime('%Y', date) = ? 
                GROUP BY week, year, nameService
            `;
    
            db.all(statQuery, [weekStr, yearStr], (err, stats) => {
                if (err) {
                    return reject(new Error("Error retrieving stats: " + err.message));
                } else {
                    stats.forEach(stat => {
                        console.log(`Week: ${stat.week}, Year: ${stat.year}, Service: ${stat.nameService}, Total Customers: ${stat.totalCustomers}`);
                    });
                    resolve(stats);  
                }
            });
        });
    }*/

    getCustomersForServiceByWeek() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    strftime('%Y-%W', date) AS week, 
                    nameService, 
                    SUM(numCustomers) AS totalCustomers 
                FROM Stat 
                GROUP BY week, nameService
            `;
    
            db.all(query, (err, stats) => {
                if (err) {
                    return reject(new Error("Error retrieving stats: " + err.message));
                }
                if (stats.length === 0) {
                    return reject(new Error("No stats for any service"));
                }
    
                stats.forEach(stat => {
                    console.log(`Week: ${stat.week}, Service: ${stat.nameService}, Total Customers: ${stat.totalCustomers}`);
                });
                resolve(stats);  
            });
        });
    }

    /*getCustomersForServiceByMonth(month, year) {
        return new Promise((resolve, reject) => {
            // Format the month
            const monthStr = month.toString().padStart(2, '0');
            const yearStr = year.toString();
    
            const statQuery = `
                SELECT 
                    strftime('%m', date) AS month, 
                    strftime('%Y', date) AS year, 
                    nameService, 
                    SUM(numCustomers) AS totalCustomers 
                FROM Stat 
                WHERE strftime('%m', date) = ? 
                  AND strftime('%Y', date) = ? 
                GROUP BY month, year, nameService
            `;
    
            db.all(statQuery, [monthStr, yearStr], (err, stats) => {
                if (err) {
                    return reject(new Error("Error retrieving stats: " + err.message));
                } else {
                    stats.forEach(stat => {
                        console.log(`Month: ${stat.month}, Year: ${stat.year}, Service: ${stat.nameService}, Total Customers: ${stat.totalCustomers}`);
                    });
                    resolve(stats);  
                }
            });
        });
    }*/

    getCustomersForServiceByMonth() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    strftime('%Y-%m', date) AS month, 
                    nameService, 
                    SUM(numCustomers) AS totalCustomers 
                FROM Stat 
                GROUP BY month, nameService
            `;
    
            db.all(query, (err, stats) => {
                if (err) {
                    return reject(new Error("Error retrieving stats: " + err.message));
                }
                if (stats.length === 0) {
                    return reject(new Error("No stats for any service"));
                }
    
                stats.forEach(stat => {
                    console.log(`Month: ${stat.month}, Service: ${stat.nameService}, Total Customers: ${stat.totalCustomers}`);
                });
                resolve(stats);  
            });
        });
    }


    getDailyCustomersForEachCounterByService() {
        return new Promise((resolve, reject) => {
            const date = dayjs().format('YYYY-MM-DD');
            const query = `
                SELECT st.date, cs.counterId, s.name AS serviceName, SUM(st.numCustomers) AS totalCustomers
                FROM Stat st
                JOIN CounterService cs ON st.nameService = cs.serviceName
                JOIN Service s ON cs.serviceName = s.name
                WHERE st.date = '${date}'
                GROUP BY st.date, cs.counterId, s.name
                ORDER BY st.date, cs.counterId, s.name
            `;
    
            db.all(query, (err, rows) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(new Error("Error accessing the Stat table: " + err.message));
                }
                if (!rows || rows.length === 0) {
                    return reject(new Error("No daily stats found for any counter and service."));
                }
                resolve(rows);
            });
        });
    }

    getWeeklyCustomersForEachCounterByService() {
        return new Promise((resolve, reject) => {
            const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
            const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD');
            const query = `
                SELECT 
                    st.date, 
                    strftime('%W', st.date) AS week, 
                    cs.counterId, 
                    s.name AS serviceName, 
                    SUM(st.numCustomers) AS totalCustomers
                FROM Stat st
                JOIN CounterService cs ON st.nameService = cs.serviceName
                JOIN Service s ON cs.serviceName = s.name
                WHERE st.date BETWEEN '${weekStart}' AND '${weekEnd}'
                GROUP BY st.date, week, cs.counterId, s.name
                ORDER BY st.date, cs.counterId, s.name
            `;
    
            db.all(query, (err, rows) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(new Error("Error accessing the Stat table: " + err.message));
                }
                if (!rows || rows.length === 0) {
                    return reject(new Error("No weekly stats found for any counter and service."));
                }
                resolve(rows);
            });
        });
    }

    getMonthlyCustomersForEachCounterByService() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    strftime('%Y-%m', st.date) AS month, 
                    cs.counterId, 
                    s.name AS serviceName, 
                    SUM(st.numCustomers) AS totalCustomers
                FROM Stat st
                JOIN CounterService cs ON st.nameService = cs.serviceName
                JOIN Service s ON cs.serviceName = s.name
                WHERE st.date BETWEEN date('now', 'start of month') AND date('now', 'start of month', '+1 month', '-1 day')
                GROUP BY month, cs.counterId, s.name
                ORDER BY month, cs.counterId, s.name
            `;
    
            db.all(query, (err, rows) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(new Error("Error accessing the Stat table: " + err.message));
                }
                if (!rows || rows.length === 0) {
                    return reject(new Error("No monthly stats found for any counter and service."));
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