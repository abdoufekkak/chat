const express = require("express");
const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controlleur/usersController.js");
const router = express.Router();
router.get("/allusers/:id", getAllUsers);

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id", setAvatar);

module.exports = router;
