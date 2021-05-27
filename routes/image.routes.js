const express = require('express');
const router = express.Router();

const {uploadImage, deleteImage} = require('../controllers/image.controllers');

const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router.route('/').post(authCheck, adminCheck, uploadImage);
router.route('/delete').post(authCheck, adminCheck, deleteImage);

module.exports = router;
