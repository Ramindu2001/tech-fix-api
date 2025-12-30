const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, serviceController.getAllServices);
router.post('/', protect, adminOnly, serviceController.addService);
router.delete('/:id', protect, adminOnly, serviceController.deleteService);

module.exports = router;