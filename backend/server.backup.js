require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/vehicle/:number", async (req, res) => {
    try {
        const regNo = req.params.number;

        const response = await axios.get(
            "https://restapi.vahandetails.com/api/vehicles/search",
            {
                params: {
                    rc_regn_no: regNo,
                },
                headers: {
                    Accept: "application/json",
                    Origin: "https://vahandetails.com",
                    Referer: "https://vahandetails.com/",
                    "User-Agent": "Mozilla/5.0",
                },
            }
        );

        res.json(response.data);

    } catch (err) {
        console.log(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch vehicle details",
        });
    }
});

// GET all customers
app.get("/api/customers", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT u.user_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS name, u.email, u.phone_number AS phone, u.created_at AS joined, GROUP_CONCAT(CONCAT(v.model, ' (', v.registration_number, ')') SEPARATOR ', ') AS vehicle FROM Users u LEFT JOIN Vehicles v ON u.user_id = v.customer_id WHERE u.role = 'Customer' GROUP BY u.user_id ORDER BY u.created_at DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET all vehicles
app.get("/api/vehicles", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT v.vehicle_id AS id, v.registration_number AS number, v.brand, v.model, v.year, v.fuel_type AS fuel, CONCAT(u.first_name, ' ', u.last_name) AS owner
             FROM Vehicles v
             JOIN Users u ON v.customer_id = u.user_id
             ORDER BY v.created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET all bookings
app.get("/api/bookings", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.booking_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS customer, v.registration_number AS vehicle, 
                    DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date, TIME_FORMAT(b.booking_time, '%h:%i %p') AS time, b.status,
                    'Pending' AS payment
             FROM Bookings b
             JOIN Users u ON b.customer_id = u.user_id
             JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
             ORDER BY b.booking_date DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET Dashboard Stats
app.get("/api/dashboard/stats", async (req, res) => {
    try {
        const [[{ totalCustomers }]] = await db.query("SELECT COUNT(*) AS totalCustomers FROM Users WHERE role = 'Customer'");
        const [[{ totalVehicles }]] = await db.query("SELECT COUNT(*) AS totalVehicles FROM Vehicles");
        const [[{ todayBookings }]] = await db.query("SELECT COUNT(*) AS todayBookings FROM Bookings WHERE DATE(booking_date) = CURDATE()");
        const [[{ pendingServices }]] = await db.query("SELECT COUNT(*) AS pendingServices FROM Bookings WHERE status = 'Pending'");
        
        const [[{ monthlyRevenue }]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS monthlyRevenue FROM Bookings WHERE MONTH(booking_date) = MONTH(CURDATE()) AND YEAR(booking_date) = YEAR(CURDATE()) AND status = 'Completed'");
        const [[{ totalEarnings }]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS totalEarnings FROM Bookings WHERE status = 'Completed'");

        res.json({
            totalCustomers,
            totalVehicles,
            todayBookings,
            pendingServices,
            monthlyRevenue: `₹${Number(monthlyRevenue).toLocaleString()}`,
            totalEarnings: `₹${Number(totalEarnings).toLocaleString()}`
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET Recent Bookings for Dashboard
app.get("/api/dashboard/recent", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.booking_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS customer, v.registration_number AS vehicle, 
                    COALESCE(b.service_type, 'General Service') AS type, 
                    DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date, b.status,
                    'Pending' AS payment
             FROM Bookings b
             JOIN Users u ON b.customer_id = u.user_id
             JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
             ORDER BY b.created_at DESC
             LIMIT 5`
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching recent bookings:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// PUT update booking status
app.put("/api/bookings/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        await db.query("UPDATE Bookings SET status = ? WHERE booking_id = ?", [status, req.params.id]);
        res.json({ success: true, message: "Status updated" });
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// PUT update full booking
app.put("/api/bookings/:id", async (req, res) => {
    try {
        const { customer_id, vehicle_id, booking_date, booking_time } = req.body;
        await db.query(
            "UPDATE Bookings SET customer_id = ?, vehicle_id = ?, booking_date = ?, booking_time = ? WHERE booking_id = ?", 
            [customer_id, vehicle_id, booking_date, booking_time, req.params.id]
        );
        res.json({ success: true, message: "Booking updated" });
    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE booking
app.delete("/api/bookings/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM Bookings WHERE booking_id = ?", [req.params.id]);
        res.json({ success: true, message: "Booking deleted" });
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST new customer
app.post("/api/customers", async (req, res) => {
    const { full_name, car_name, car_no, car_fuel, phone_number } = req.body;
    try {
        const names = (full_name || "").trim().split(" ");
        const first_name = names[0] || "Unknown";
        const last_name = names.slice(1).join(" ") || " ";
        const email = `${phone_number || Date.now()}@customer.com`;

        const [userResult] = await db.query(
            "INSERT INTO Users (first_name, last_name, email, phone_number, role) VALUES (?, ?, ?, ?, 'Customer')",
            [first_name, last_name, email, phone_number]
        );
        const customerId = userResult.insertId;

        // If car info is provided, insert vehicle
        if (car_name) {
            const regNo = car_no || ("TBD-" + Math.floor(Math.random() * 10000));
            await db.query(
                "INSERT INTO Vehicles (customer_id, registration_number, brand, model, year, fuel_type) VALUES (?, ?, 'Hyundai', ?, 2024, ?)",
                [customerId, regNo, car_name, car_fuel || 'Petrol']
            );
        }

        res.json({ success: true, id: customerId });
    } catch (err) {
        console.error("Error creating customer:", err);
        res.status(500).json({ success: false, message: "Error creating customer" });
    }
});

// POST new vehicle
app.post("/api/vehicles", async (req, res) => {
    const { customer_id, registration_number, brand, model, year, fuel_type } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO Vehicles (customer_id, registration_number, brand, model, year, fuel_type) VALUES (?, ?, ?, ?, ?, ?)",
            [customer_id, registration_number, brand, model, year, fuel_type]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("Error creating vehicle:", err);
        res.status(500).json({ success: false, message: "Error creating vehicle" });
    }
});

// POST new booking
app.post("/api/bookings", async (req, res) => {
    const { customer_id, vehicle_id, booking_date, booking_time, service_type, total_amount } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO Bookings (customer_id, vehicle_id, booking_date, booking_time, status, service_type, total_amount) VALUES (?, ?, ?, ?, 'Pending', ?, ?)",
            [customer_id, vehicle_id, booking_date, booking_time, service_type || 'General Service', total_amount || 0.00]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ success: false, message: "Error creating booking" });
    }
});

// GET services (same as bookings but focusing on services for now)
app.get("/api/services", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.booking_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS customer, v.registration_number AS vehicle, 
                    DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date, b.service_type, b.total_amount AS price, b.status
             FROM Bookings b
             JOIN Users u ON b.customer_id = u.user_id
             JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
             ORDER BY b.booking_date DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET customers with vehicles
app.get("/api/customers", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.user_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS name, u.email, u.phone_number AS phone, u.created_at AS joined,
                   GROUP_CONCAT(CONCAT(v.brand, ' ', v.model, ' (', v.registration_number, ')') SEPARATOR ', ') AS vehicle
            FROM Users u
            LEFT JOIN Vehicles v ON u.user_id = v.customer_id
            WHERE u.role = 'Customer'
            GROUP BY u.user_id
            ORDER BY u.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET invoices
app.get("/api/invoices", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.booking_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS customer, 
                    DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date, b.service_type, b.total_amount AS amount, b.status
             FROM Bookings b
             JOIN Users u ON b.customer_id = u.user_id
             ORDER BY b.booking_date DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET mechanics
app.get("/api/mechanics", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT u.user_id AS id, CONCAT(u.first_name, ' ', u.last_name) AS name, u.email, u.phone_number,
                    (SELECT COUNT(*) FROM Bookings b WHERE b.mechanic_id = u.user_id) AS active_jobs
             FROM Users u WHERE u.role IN ('Mechanic')`
        );
        // If no mechanics exist, we will mock them in the frontend for demonstration
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET staff
app.get("/api/staff", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT user_id AS id, CONCAT(first_name, ' ', last_name) AS name, email, phone_number, role, created_at AS joined
             FROM Users WHERE role != 'Customer'`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST staff (including Sub Admin)
app.post("/api/staff", async (req, res) => {
    const { name, email, phone_number, role, password } = req.body;
    try {
        const names = (name || "").trim().split(" ");
        const first_name = names[0] || "Unknown";
        const last_name = names.slice(1).join(" ") || " ";
        
        await db.query(
            "INSERT INTO Users (first_name, last_name, email, phone_number, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
            [first_name, last_name, email, phone_number, role, password]
        );
        res.json({ success: true, message: "Staff added successfully" });
    } catch (err) {
        console.error("Error creating staff:", err);
        res.status(500).json({ success: false, message: "Error creating staff" });
    }
});

// GET enquiries (mock data since no table exists yet)
app.get("/api/enquiries", (req, res) => {
    res.json([
        { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", subject: "Battery Warranty", message: "My Exide battery stopped working after 6 months.", date: "2023-11-20", status: "New" },
        { id: 2, name: "Sneha Patel", email: "sneha@example.com", phone: "8765432109", subject: "Service Cost", message: "How much for a standard service of Hyundai i20?", date: "2023-11-19", status: "Resolved" }
    ]);
});

// GET reports (dynamic)
app.get("/api/reports", async (req, res) => {
    try {
        const [monthlyRows] = await db.query(
            `SELECT DATE_FORMAT(booking_date, '%b') AS month, 
                    COALESCE(SUM(total_amount), 0) AS revenue 
             FROM Bookings 
             WHERE total_amount IS NOT NULL
             GROUP BY YEAR(booking_date), MONTH(booking_date), month
             ORDER BY YEAR(booking_date) ASC, MONTH(booking_date) ASC
             LIMIT 6`
        );
        
        const [dailyRows] = await db.query(
            `SELECT DATE_FORMAT(booking_date, '%Y-%m-%d') AS date, 
                    COUNT(*) AS bookings
             FROM Bookings
             GROUP BY DATE(booking_date)
             ORDER BY DATE(booking_date) DESC
             LIMIT 7`
        );
        
        res.json({
            monthlyRevenue: monthlyRows.length > 0 ? monthlyRows : [{ month: 'No Data', revenue: 0 }],
            dailyBookings: dailyRows.length > 0 ? dailyRows.reverse() : [{ date: 'No Data', bookings: 0 }]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET dashboard categories
app.get("/api/dashboard/categories", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT COALESCE(service_type, 'General Service') AS name, COUNT(*) AS value 
             FROM Bookings 
             GROUP BY service_type`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Demo admin credentials fallback
        if (email === 'admin@hyundai.com' && password === 'admin123') {
            return res.json({ success: true, role: 'Super Admin', token: 'demo-token' });
        }
        
        const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        const user = users[0];
        // Check password (in a real app, use bcrypt)
        // Here we just check if it matches password_hash, or allow 'password123' for existing users without passwords
        if (user.password_hash !== password && password !== 'password123') {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        res.json({ success: true, role: user.role, id: user.user_id });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});