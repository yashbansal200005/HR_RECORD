const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');
const authenticateToken = require('../middleware/auth');

// All HR routes require authentication
router.use(authenticateToken);

router.get('/', hrController.getAllHRRecords);
router.post('/', hrController.createHRRecord);
router.put('/:id', hrController.updateHRRecord);
router.patch('/:id/active', hrController.toggleActiveStatus);

module.exports = router;

