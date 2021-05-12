const express = require('express');
const router = express.Router();

const { createOrUpdateUser, getCurrentUser } = require('../controllers/auth.controllers')

const { authCheck, adminCheck } = require('../middlewares/auth.middleware')

router.route('/').post(authCheck, createOrUpdateUser);
router.route('/current').get(authCheck, getCurrentUser);
router.route('/admin').get(authCheck, adminCheck, getCurrentUser);

module.exports = router;
