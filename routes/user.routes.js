const express = require('express');
const router = express.Router();

const {
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddress,
} = require('../controllers/user.controllers');

const { authCheck } = require('../middlewares/auth.middleware');

router.route('/address/add').post(authCheck, addUserAddress);
router.route('/address/delete/:_id').delete(authCheck, deleteUserAddress);
router.route('/address/update/:_id').put(authCheck, updateUserAddress);
router.route('/address/:_id').get(authCheck, getUserAddress);

module.exports = router;
