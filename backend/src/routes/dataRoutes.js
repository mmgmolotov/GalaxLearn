const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Define routes
router.get('/', dataController.getAllData);
router.post('/', dataController.createData);

module.exports = router;
