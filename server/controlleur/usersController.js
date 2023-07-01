const usermodel = require("../model/usersModel");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const usermainCheck = await usermodel.findOne({ username });
  if (usermainCheck) {
    return res.json({ msg: "username already exist", status: false });
  }
  const emailcheck = await usermodel.findOne({ email });
  if (emailcheck) {
    return res.json({ msg: "email already exist", status: false });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await usermodel.create({
    email,
    username,
    password: hashPassword,
  });
  delete user.password;
  return res.status(200).json({ status: true, user });
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await usermodel.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await usermodel.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const users = await usermodel.find(
      { _id: { $ne: userId } },
      { email: 1, username: 1, avatarImage: 1, _id: 1 }
    );
    return res.json(users);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};
