const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, customerController.getAllCustomers);
router.post('/', protect, customerController.addCustomer);
router.put('/:id', protect, customerController.updateCustomer);

module.exports = router;    