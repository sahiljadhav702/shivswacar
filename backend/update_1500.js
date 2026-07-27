const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  try {
    const conn = await mysql.createConnection({ 
      host: 'localhost', 
      user: 'root', 
      password: 'roo@123456', 
      database: 'car_service_db' 
    });
    
    const [rows] = await conn.query('SELECT id, parts FROM servicepackage');
    
    for (const row of rows) {
      let partsArr = [];
      try {
        partsArr = typeof row.parts === 'string' ? JSON.parse(row.parts) : (row.parts || []);
      } catch(e) {}
      
      if (!partsArr.includes(1500)) {
        partsArr.push(1500);
        await conn.query(
          'UPDATE servicepackage SET parts = ? WHERE id = ?', 
          [JSON.stringify(partsArr), row.id]
        );
      }
    }
    
    console.log('Successfully added 1500 Km interval to all parts.');
    await conn.end();
  } catch(err) {
    console.error('Error updating parts:', err);
  }
}

run();
