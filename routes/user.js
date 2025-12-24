const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm) // Signup Form
  .post(userController.signUp); // Signup Route

router
  .route("/login")
  .get(userController.renderLoginForm) // Login Form
  .post(saveRedirectUrl, userController.login); // Login Route - Add saveRedirectUrl middleware

// Logout Route
router.get("/logout", userController.logout);

module.exports = router;
