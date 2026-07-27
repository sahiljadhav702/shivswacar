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
    
    const parts = [
      ['Air Filter', 350], 
      ['Engine Oil', 1672], 
      ['Engine Oil Filter', 107], 
      ['AC Filter', 350], 
      ['Fuel Filter', 450], 
      ['Coolant', 800], 
      ['Spark Plugs', 600], 
      ['Brake Fluid', 300], 
      ['Transmission Fluid', 1200]
    ];
    
    for (const [name, price] of parts) {
      await conn.query(
        'INSERT INTO servicepackage (name, price, duration, description, parts) VALUES (?, ?, 0, "", NULL)', 
        [name, price]
      );
      console.log(`Inserted: ${name} (₹${price})`);
    }
    
    console.log('All parts inserted successfully.');
    await conn.end();
  } catch(err) {
    console.error('Error inserting parts:', err);
  }
}

run();
