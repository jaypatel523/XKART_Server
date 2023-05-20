const express = require("express");
const router = express.Router();

const { login, logout, register, getUserDetails, adminLogin, getUser, loginWithGoogle, registerWithGoogle, generateOTP } = require("../controllers/user");

router.route("/generateOTP").post(generateOTP);
router.route("/register").post(register);
router.route("/registerWithGoogle").post(registerWithGoogle);
router.route("/login").post(login);
router.route("/loginWithGoogle").post(loginWithGoogle);
router.route("/adminLogin").post(adminLogin);
router.route("/logout").get(logout);
router.route("/getUser").post(getUser);
router.route('/getuserdetails/:userId').get(getUserDetails);

module.exports = router;
