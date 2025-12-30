const db = require('../db/db');

// 1. Get All Customers
exports.getAllCustomers = async (req, res) => {
    try {
        const [customers] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Add New Customer
exports.addCustomer = async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [name, email, phone, address]
        );
        res.status(201).json({ message: 'Customer added', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update Customer 
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        await db.query(
            'UPDATE customers SET name=?, email=?, phone=?, address=? WHERE customer_id=?',
            [name, email, phone, address, id]
        );
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};