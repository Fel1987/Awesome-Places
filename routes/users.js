const express = require("express");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../middleware");
const passport = require("passport");
const router = express.Router();

//Controller
const users = require("../controllers/users");

router.get("/register", users.renderRegisterForm);

router.post("/register", catchAsync(users.registerUser));

router.get("/login", users.renderLoginForm);

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login,
);

router.get("/logout", users.logout);

module.exports = router;
