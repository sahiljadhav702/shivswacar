const mysql = require('mysql2/promise');
async function test() { 
    const pool = mysql.createPool({host: 'sakura.proxy.rlwy.net', user: 'root', password: 'eweAkyBZuNruAGcyLYcRkBItzzzClhJf', database: 'railway', port: 35399}); 
    try { 
        const [res] = await pool.query(`SELECT c.id AS id, c.name AS name, c.email, c.mobile AS phone, c.createdAt AS joined, GROUP_CONCAT(CONCAT(v.model, ' (', v.vehicleNumber, ')') SEPARATOR ', ') AS vehicle FROM customer c LEFT JOIN vehicle v ON c.id = v.customerId GROUP BY c.id ORDER BY c.createdAt DESC`); 
        console.log(res); 
    } catch (err) { 
        console.error('DB ERROR:', err.message); 
    } 
    process.exit(0); 
} 
test();
