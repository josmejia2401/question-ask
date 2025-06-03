const express = require('express');
const router = express.Router();
const controller = require('../controllers/forms-controller');
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/', ensureAuthenticated, controller.getAllForms);
router.get('/:id', ensureAuthenticated, controller.getFormById);
router.post('/', ensureAuthenticated, controller.createForm);
router.put('/:id', ensureAuthenticated, controller.updateForm);
router.delete('/:id', ensureAuthenticated, controller.deleteForm);

module.exports = router;
