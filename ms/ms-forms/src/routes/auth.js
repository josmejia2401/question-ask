const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth-controller');

router.post('/login', auth.login);
router.post('/request-password-reset', auth.requestPasswordReset);
router.post('/reset-password', auth.resetPassword);

module.exports = router;
