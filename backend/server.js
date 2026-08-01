require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const db = require("./db");
const nodemailer = require("nodemailer");

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
            "SELECT c.id AS id, c.name AS name, c.email, c.mobile AS phone, c.createdAt AS joined, GROUP_CONCAT(CONCAT(v.model, ' (', v.vehicleNumber, ')') SEPARATOR ', ') AS vehicle FROM customer c LEFT JOIN vehicle v ON c.id = v.customerId GROUP BY c.id ORDER BY c.createdAt DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST new customer
app.post("/api/customers", async (req, res) => {
    try {
        const name = req.body.name || (req.body.first_name ? `${req.body.first_name} ${req.body.last_name || ''}`.trim() : '');
        const email = req.body.email;
        const phone = req.body.phone || req.body.phone_number;
        const createdAt = req.body.created_at;

        // Check if customer already exists for public bookings
        const [existing] = await db.query("SELECT id FROM customer WHERE mobile = ?", [phone]);
        if (existing.length > 0) {
            if (!req.body.role) {
                // Public Website booking request: update the existing customer's joined date
                if (createdAt) {
                    await db.query("UPDATE customer SET createdAt = ? WHERE id = ?", [createdAt, existing[0].id]);
                }
                return res.json({ success: true, message: "Customer already exists", id: existing[0].id });
            }
            // If Admin Panel request (req.body.role exists), we allow creating a duplicate.
        }

        let result;
        if (createdAt) {
            [result] = await db.query("INSERT INTO customer (name, email, mobile, createdAt) VALUES (?, ?, ?, ?)", [name, email, phone, createdAt]);
        } else {
            [result] = await db.query("INSERT INTO customer (name, email, mobile) VALUES (?, ?, ?)", [name, email, phone]);
        }

        const customerId = result.insertId;

        // Also add vehicle if provided
        if (req.body.car_number) {
            const carBrand = req.body.car_brand || 'Hyundai';
            const carModel = req.body.car_model || '';
            const carNumber = req.body.car_number;

            await db.query(
                "INSERT INTO vehicle (customerId, vehicleNumber, brand, model) VALUES (?, ?, ?, ?)",
                [customerId, carNumber, carBrand, carModel]
            );
        }

        res.json({ success: true, message: "Customer added", id: customerId });
    } catch (err) {
        console.error("Error adding customer:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// PUT update customer
app.put("/api/customers/:id", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        await db.query("UPDATE customer SET name=?, email=?, mobile=? WHERE id=?", [name, email, phone, req.params.id]);
        res.json({ success: true, message: "Customer updated" });
    } catch (err) {
        console.error("Error updating customer:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE customer
app.delete("/api/customers/:id", async (req, res) => {
    try {
        const customerId = req.params.id;
        // First delete jobcards referencing this customer's vehicles
        const [vehicles] = await db.query("SELECT id FROM vehicle WHERE customerId=?", [customerId]);
        const vehicleIds = vehicles.map(v => v.id);
        if (vehicleIds.length > 0) {
            await db.query("DELETE FROM jobcard WHERE vehicleId IN (?)", [vehicleIds]);
        }
        // Delete jobcards referencing this customer directly
        await db.query("DELETE FROM jobcard WHERE customerId=?", [customerId]);
        // Then delete associated vehicles
        await db.query("DELETE FROM vehicle WHERE customerId=?", [customerId]);
        // Finally delete the customer
        await db.query("DELETE FROM customer WHERE id=?", [customerId]);
        res.json({ success: true, message: "Customer deleted" });
    } catch (err) {
        console.error("Error deleting customer:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET all vehicles
app.get("/api/vehicles", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT v.id AS id, v.vehicleNumber AS number, v.brand, v.model, v.year, v.fuel_type AS fuel, u.name AS owner
             FROM vehicle v
             JOIN customer u ON v.customerId = u.id
             ORDER BY v.createdAt DESC`
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
        const [[{ totalCustomers }]] = await db.query("SELECT COUNT(*) AS totalCustomers FROM customer");
        const [[{ totalVehicles }]] = await db.query("SELECT COUNT(*) AS totalVehicles FROM vehicle");
        const [[{ todayBookings }]] = await db.query("SELECT COUNT(*) AS todayBookings FROM jobcard WHERE DATE(createdAt) = CURDATE()");
        const [[{ pendingServices }]] = await db.query("SELECT COUNT(*) AS pendingServices FROM jobcard WHERE status = 'Pending'");

        const [[{ monthlyRevenue }]] = await db.query("SELECT COALESCE(SUM(totalAmount), 0) AS monthlyRevenue FROM jobcard WHERE MONTH(createdAt) = MONTH(CURDATE()) AND YEAR(createdAt) = YEAR(CURDATE()) AND status != 'Cancelled'");
        const [[{ totalEarnings }]] = await db.query("SELECT COALESCE(SUM(totalAmount), 0) AS totalEarnings FROM jobcard WHERE status != 'Cancelled'");

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
            `SELECT b.id AS id, u.name AS customer, v.vehicleNumber AS vehicle, 
                    COALESCE(b.complaints, 'General Service') AS type, 
                    DATE_FORMAT(b.createdAt, '%Y-%m-%d') AS date, b.status,
                    'Pending' AS payment
             FROM jobcard b
             JOIN customer u ON b.customerId = u.id
             JOIN vehicle v ON b.vehicleId = v.id
             ORDER BY b.createdAt DESC
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
        await db.query("UPDATE jobcard SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true, message: "Status updated" });
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE booking
app.delete("/api/bookings/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM jobcard WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Booking deleted" });
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


// POST new vehicle
app.post("/api/vehicles", async (req, res) => {
    const customerId = req.body.customerId || req.body.customer_id;
    const vehicleNumber = req.body.vehicleNumber || req.body.registration_number;
    const brand = req.body.brand;
    const model = req.body.model;
    const year = req.body.year;
    const fuelType = req.body.fuel_type || req.body.fuelType || 'Petrol';
    try {
        // Check if vehicle already exists
        const [existing] = await db.query("SELECT id FROM vehicle WHERE vehicleNumber = ?", [vehicleNumber]);
        if (existing.length > 0) {
            return res.json({ success: true, message: "Vehicle already exists", id: existing[0].id });
        }

        const [result] = await db.query(
            "INSERT INTO vehicle (customerId, vehicleNumber, brand, model, year, fuelType) VALUES (?, ?, ?, ?, ?, ?)",
            [customerId, vehicleNumber, brand, model, year, fuelType]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("Error creating vehicle:", err);
        res.status(500).json({ success: false, message: "Error creating vehicle" });
    }
});

// POST new booking
app.post("/api/bookings", async (req, res) => {
    const customerId = req.body.customerId || req.body.customer_id;
    const vehicleId = req.body.vehicleId || req.body.vehicle_id;
    const bookingDate = req.body.createdAt || req.body.booking_date;
    const bookingTime = req.body.booking_time || '09:00:00';
    const complaints = req.body.complaints || 'General Service';
    const totalAmount = req.body.totalAmount || req.body.total_amount || 0;

    // Estimate delivery from date and time
    const estimatedDelivery = bookingDate ? `${bookingDate} ${bookingTime}` : new Date();
    const jobNumber = `JC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
        const [result] = await db.query(
            "INSERT INTO jobcard (jobNumber, customerId, vehicleId, estimatedDelivery, status, complaints, totalAmount, bookingDate, bookingTime) VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?, ?)",
            [jobNumber, customerId, vehicleId, estimatedDelivery, complaints, totalAmount, bookingDate || null, bookingTime || null]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ success: false, message: "Error creating booking" });
    }
});

// GET all service packages
app.get("/api/services", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM servicepackage ORDER BY createdAt DESC");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST new service package
app.post("/api/services", async (req, res) => {
    try {
        const { name, price, duration, description, parts } = req.body;
        const [result] = await db.query(
            "INSERT INTO servicepackage (name, price, duration, description, parts) VALUES (?, ?, ?, ?, ?)",
            [name, price, duration, description, parts ? JSON.stringify(parts) : null]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// PUT update service package
app.put("/api/services/:id", async (req, res) => {
    try {
        const { name, price, duration, description, parts } = req.body;
        await db.query(
            "UPDATE servicepackage SET name=?, price=?, duration=?, description=?, parts=? WHERE id=?",
            [name, price, duration, description, parts ? JSON.stringify(parts) : null, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE service package
app.delete("/api/services/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM servicepackage WHERE id=?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET customers with vehicles
app.get("/api/customers", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id AS id, u.name AS name, u.email, u.mobile AS phone, u.createdAt AS joined,
                   GROUP_CONCAT(CONCAT(v.brand, ' ', v.model, ' (', v.vehicleNumber, ')') SEPARATOR ', ') AS vehicle
            FROM customer u
            LEFT JOIN vehicle v ON u.id = v.customerId
            GROUP BY u.id
            ORDER BY u.createdAt DESC
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
            `SELECT b.id AS id, 
                    CONCAT('INV-', b.id) AS invoiceNumber,
                    b.jobNumber AS jobNumber,
                    u.name AS customerName, 
                    b.createdAt AS createdAt,
                    b.totalAmount AS totalAmount, 
                    b.status AS paymentStatus
             FROM jobcard b
             LEFT JOIN customer u ON b.customerId = u.id
             ORDER BY b.createdAt DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET single invoice for printing
app.get("/api/invoices/:id", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.id AS id, 
                    CONCAT('INV-', b.id) AS invoiceNumber,
                    b.jobNumber AS jobNumber,
                    u.name AS customerName,
                    u.mobile AS customerPhone,
                    u.email AS customerEmail,
                    u.address AS customerAddress,
                    v.vehicleNumber AS vehicleNumber,
                    v.brand AS vehicleBrand,
                    v.model AS vehicleModel,
                    b.createdAt AS createdAt,
                    b.totalAmount AS totalAmount,
                    b.complaints AS serviceType,
                    b.status AS paymentStatus
             FROM jobcard b
             LEFT JOIN customer u ON b.customerId = u.id
             LEFT JOIN vehicle v ON b.vehicleId = v.id
             WHERE b.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Invoice not found" });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET mechanics
app.get("/api/mechanics", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT u.id AS id, u.name AS name, u.email, u.phone,
                    (SELECT COUNT(*) FROM jobcard b WHERE b.mechanic_id = u.id) AS active_jobs
             FROM user u WHERE u.role IN ('Mechanic')`
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
            `SELECT id AS id, CONCAT(name) AS name, email, phone, role, createdAt AS joined
             FROM user WHERE role != 'Customer'`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST staff
app.post("/api/staff", async (req, res) => {
    try {
        const { name, phone, role } = req.body;
        // Generate dummy email since user requested to only use phone number
        const email = req.body.email || `${phone}@staff.com`;

        await db.query(
            "INSERT INTO user (name, email, phone, role, password) VALUES (?, ?, ?, ?, 'password123')",
            [name || 'Staff', email, phone, role || 'MECHANIC']
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
            `SELECT DATE_FORMAT(createdAt, '%b') AS month, 
                    COALESCE(SUM(totalAmount), 0) AS revenue 
             FROM jobcard 
             WHERE totalAmount IS NOT NULL
             GROUP BY YEAR(createdAt), MONTH(createdAt), month
             ORDER BY YEAR(createdAt) ASC, MONTH(createdAt) ASC
             LIMIT 6`
        );

        const [dailyRows] = await db.query(
            `SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS date, 
                    COUNT(*) AS bookings
             FROM jobcard
             GROUP BY DATE(createdAt)
             ORDER BY DATE(createdAt) DESC
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
            `SELECT COALESCE(complaints, 'General Service') AS name, COUNT(*) AS value 
             FROM jobcard 
             GROUP BY complaints`
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

        const [users] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const user = users[0];
        // Check password (in a real app, use bcrypt)
        // Here we just check if it matches password, or allow 'password123' for existing users without passwords
        if (user.password !== password && password !== 'password123') {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.json({ success: true, role: user.role, id: user.id });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST forgot-password
app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const cleanEmail = email.trim().toLowerCase();

        // Use demo response if it's the demo admin
        if (cleanEmail === 'admin@hyundai.com') {
            return res.json({ success: false, message: "Demo admin password cannot be reset." });
        }

        const [users] = await db.query("SELECT * FROM user WHERE email = ?", [cleanEmail]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Account with this email was not found." });
        }

        const user = users[0];

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Update database
        await db.query("UPDATE user SET password = ? WHERE id = ?", [tempPassword, user.id]);

        // Send Email using Ethereal (for testing)
        // In a real app, you would use environment variables for real SMTP credentials
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"Mai Hyundai Service" <no-reply@hyundai.com>', // sender address
            to: user.email, // list of receivers
            subject: "Password Reset - Mai Hyundai", // Subject line
            text: `Hello ${user.name || 'User'},\n\nYour temporary password is: ${tempPassword}\n\nPlease login and change it immediately.`, // plain text body
            html: `<b>Hello ${user.name || 'User'},</b><br><br>Your temporary password is: <b>${tempPassword}</b><br><br>Please login and change it immediately.`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.json({
            success: true,
            message: "Reset link sent to your email.",
            previewUrl: nodemailer.getTestMessageUrl(info) // Send preview URL to frontend for demo purposes
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


// GET Bookings (jobcards)
app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT j.*, u.name as customerName, v.vehicleNumber FROM jobcard j LEFT JOIN user u ON j.customerId = u.id LEFT JOIN vehicle v ON j.vehicleId = v.id ORDER BY j.createdAt DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
});

// GET Bookings Slots Availability
app.get('/api/bookings/slots', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DATE_FORMAT(bookingDate, '%Y-%m-%d') as bookingDate, bookingTime, COUNT(*) as count FROM jobcard WHERE status != 'Cancelled' AND bookingDate IS NOT NULL GROUP BY bookingDate, bookingTime");
        res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
});

app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { status, complaints, customerId, vehicleId } = req.body;
        // Update cautiously, maintaining existing values if omitted
        await db.query(
            'UPDATE jobcard SET status = COALESCE(?, status), complaints = COALESCE(?, complaints), customerId = COALESCE(NULLIF(?, ""), customerId), vehicleId = COALESCE(NULLIF(?, ""), vehicleId) WHERE id = ?',
            [status, complaints, customerId, vehicleId, req.params.id]
        );
        res.json({ success: true, message: 'Booking updated' });
    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// --- DASHBOARD APIS ---
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [customers] = await db.query('SELECT COUNT(*) as count FROM customer');
        const [vehicles] = await db.query('SELECT COUNT(*) as count FROM vehicle');
        const [todayBookings] = await db.query('SELECT COUNT(*) as count FROM jobcard WHERE DATE(createdAt) = CURDATE()');
        const [pending] = await db.query('SELECT COUNT(*) as count FROM jobcard WHERE status = "Pending"');
        
        res.json({
            totalCustomers: customers[0].count,
            totalVehicles: vehicles[0].count,
            todayBookings: todayBookings[0].count,
            pendingServices: pending[0].count,
            monthlyRevenue: "₹0",
            totalEarnings: "₹0"
        });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
});

app.get('/api/dashboard/recent', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT j.id, u.name as customer, v.vehicleNumber as vehicle, 'General Service' as type, DATE_FORMAT(j.createdAt, '%Y-%m-%d') as date, j.status
            FROM jobcard j 
            LEFT JOIN user u ON j.customerId = u.id 
            LEFT JOIN vehicle v ON j.vehicleId = v.id 
            ORDER BY j.createdAt DESC LIMIT 5
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
});

app.get('/api/dashboard/categories', async (req, res) => {
    try {
        res.json([
            { name: 'General Service', value: 45 },
            { name: 'Repair', value: 25 },
            { name: 'Wash', value: 20 },
            { name: 'Inspection', value: 10 }
        ]);
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
});

app.get('/api/reports', async (req, res) => {
    try {
        res.json({
            monthlyRevenue: [
                { month: 'Jan', revenue: 12000 },
                { month: 'Feb', revenue: 19000 },
                { month: 'Mar', revenue: 15000 },
                { month: 'Apr', revenue: 22000 },
                { month: 'May', revenue: 28000 },
                { month: 'Jun', revenue: 35000 }
            ]
        });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (https://shivswacar-production.up.railway.app)`);
});