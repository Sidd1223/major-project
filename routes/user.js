const express  = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const { isLoggedIn } = require("../middleware.js");
const constroller = require("../controllers/users.js");


// Signup
router.route("/signup")
.get(constroller.renderSignupForm)
.post(wrapAsync(constroller.Signup));

// Login
router.route("/login")
.get(constroller.renderLoginForm)
.post(savedRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), wrapAsync(constroller.Login));


// Logout
router.get("/logout", isLoggedIn, (constroller.Logout));

module.exports = router;