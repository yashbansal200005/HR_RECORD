const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authenticateToken = require('../middleware/auth');

// All company routes require authentication
router.use(authenticateToken);

router.get('/', companyController.getAllCompanies);
router.post('/', companyController.createCompany);

module.exports = router;

