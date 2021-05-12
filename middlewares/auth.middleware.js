const fbAdmin = require('../firebase');
const User = require('../models/user.model');

const authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await fbAdmin
      .auth()
      .verifyIdToken(req.headers.authorization);
    req.user = firebaseUser;
    next();
  } catch (error) {
    res.status(401).json({
      err: error.message,
    });
  }
};

const adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const currentUser = await User.findOne({ email }).exec();

  if (currentUser.role !== 'admin') {
    res.status(403).json({
      error: 'Accès interdit!',
    });
  } else {
    next();
  }
};

module.exports = {
  authCheck,
  adminCheck,
};
