const express = require('express');
const router = express.Router();
const { registerUser, getAllTests, getTest, submitTest } = require('../controllers/userController');

router.post('/auth/user', registerUser);
router.get('/test/all', getAllTests);
router.get('/test/:id', getTest);
router.post('/test/submit', submitTest);

module.exports = router;
