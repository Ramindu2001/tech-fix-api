const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, orderController.getAllOrders);
router.post('/', protect, adminOnly, orderController.createOrder);
router.post('/:id/complete', protect, orderController.completeOrder);

module.exports = router;