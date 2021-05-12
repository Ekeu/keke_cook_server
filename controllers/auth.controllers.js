const User = require('../models/user.model');

const createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;
  const user = await User.findOneAndUpdate(
    { email },
    { displayName: name, photoURL: picture },
    { new: true }
  );

  if (user) {
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      displayName: name,
      photoURL: picture,
    }).save();
    res.json(newUser);
  }
};

const getCurrentUser = async (req, res) => {
  const user = User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};

module.exports = {
  createOrUpdateUser,
  getCurrentUser,
};
