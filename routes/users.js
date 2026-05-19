const express = require("express");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../middleware");
const passport = require("passport");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (error) => {
        if (error) next(error);
        req.flash("success", "Welcome to YelpCamp");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash(
      "success",
      `Welcome back, ${req.user.username[0].toUpperCase() + req.user.username.slice(1)}`,
    );
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res, next) => {
  req.logOut(function (error) {
    if (error) {
      return next(error);
    }
  });
  req.flash("success", "logged out. Come back soon!");
  res.redirect("/campgrounds");
});

module.exports = router;
