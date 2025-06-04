const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files-controller');
const { ensureAuthenticated } = require('../middlewares/auth');

router.post(
    '/forms/:formId/upload',
    ensureAuthenticated,
    filesController.uploadImages
);


router.get('/forms/:formId/images',
    ensureAuthenticated,
    filesController.listImages
);

router.get('/forms/:formId/images/:imageName',
    ensureAuthenticated,
    filesController.getImage
);

module.exports = router;
