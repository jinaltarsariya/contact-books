var express = require("express");
const {
  postUserSignup,
  postUserLogin,
  updateUser,
  deleteUser,
  getUser,
  getUserList,
  postForgotPassword,
  postUserOtp,
  postUserResetPassword,
  getUserResetPassword,
} = require("../controller/user-controller");
const { userToken } = require("../middleware/user-auth");
var router = express.Router();

router.post("/signup", postUserSignup);
router.post("/login", postUserLogin);
router.post("/forgotpassword", postForgotPassword);
router.post("/request", postUserOtp);
router.post("/reset/password", postUserResetPassword);
router.put("/update", userToken, updateUser);
router.delete("/delete", userToken, deleteUser);
router.get("/", getUser);
router.get("/list", getUserList);

module.exports = router;
