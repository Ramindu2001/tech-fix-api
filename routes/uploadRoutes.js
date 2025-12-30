const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../utils/fileUpload');

router.post('/', upload.single('image'), uploadController.uploadFile);

module.exports = router;