const express = require('express');
const router = express.Router();
const { loginAdmin, uploadTest, getTests, deleteTest, getTestResults } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.post('/test', adminAuth, uploadTest);
router.get('/tests', adminAuth, getTests);
router.delete('/test/:id', adminAuth, deleteTest);
router.get('/test/:id/results', adminAuth, getTestResults);

module.exports = router;
