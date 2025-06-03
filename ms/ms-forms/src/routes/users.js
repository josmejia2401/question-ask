const express = require('express');
const router = express.Router();
const controller = require('../controllers/users-controller');
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/:id', ensureAuthenticated, controller.getUserById);
router.post('/', controller.createUser);
router.put('/:id', ensureAuthenticated, controller.updateUser);
router.delete('/:id', ensureAuthenticated, controller.deleteUser);

module.exports = router;
