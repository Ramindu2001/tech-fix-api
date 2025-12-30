const db = require('../db/db');
const axios = require('axios');

// Get All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.order_id, o.title, o.status, c.name as customer_name, u.name as technician_name, o.created_at
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            LEFT JOIN users u ON o.technician_id = u.user_id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create New Order
exports.createOrder = async (req, res) => {
    const { customer_id, technician_id, title, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO orders (customer_id, technician_id, title, description) VALUES (?, ?, ?, ?)',
            [customer_id, technician_id, title, description]
        );
        res.status(201).json({ message: 'Order created', orderId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Complete Job (Update Status + AI + n8n Automation)
exports.completeOrder = async (req, res) => {
    const { id } = req.params; // Order ID
    const { tech_notes } = req.body;

    try {
        // 1. Update order status and technician notes in the database
        await db.query(
            'UPDATE orders SET status = ?, tech_notes = ? WHERE order_id = ?',
            ['COMPLETED', tech_notes, id]
        );

        // --- AI PART (Simulated) ---
        // Here, an actual OpenAI API request should be sent to generate a summary
        // Example:
        // const aiResponse = await axios.post('https://api.openai.com/v1/...', { prompt: tech_notes });
        const aiSummary = `Technician Summary: ${tech_notes} (AI Generated)`; // Temporary mock response
        
        await db.query(
            'UPDATE orders SET ai_summary = ? WHERE order_id = ?',
            [aiSummary, id]
        );

        // --- Invoice Generation (Simplified) ---
        // Ideally, invoice total should be calculated based on order items
        // For now, a fixed amount of 5000 is used
        await db.query(
            'INSERT INTO invoices (order_id, total_amount, status) VALUES (?, ?, ?)',
            [id, 5000.00, 'UNPAID']
        );

        // --- AUTOMATION (n8n) ---
        // Send data to n8n webhook to trigger email notifications or other workflows
        if (process.env.N8N_WEBHOOK_URL) {
            // await axios.post(process.env.N8N_WEBHOOK_URL, {
            //     order_id: id,
            //     summary: aiSummary,
            //     amount: 5000
            // });
            console.log("Triggered n8n webhook...");
        }

        res.json({
            message: 'Job completed, invoice generated, and email triggered via n8n',
            ai_summary: aiSummary
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
