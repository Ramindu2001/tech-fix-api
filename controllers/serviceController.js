const db = require('../db/db');

// 1. Get All Services 
exports.getAllServices = async (req, res) => {
    try {
        const [services] = await db.query('SELECT * FROM services WHERE is_active = TRUE');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Add Service (Admin Only)
exports.addService = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO services (name, description, price) VALUES (?, ?, ?)',
            [name, description, price]
        );
        res.status(201).json({ message: 'Service added', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Delete Service (Soft Delete - Admin Only)
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        // is_active = FALSE .
        await db.query('UPDATE services SET is_active = FALSE WHERE service_id = ?', [id]);
        res.json({ message: 'Service deactivated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};