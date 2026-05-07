const express = require("express");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }

    // const { username, email, password } = req.body;
    // const user = new User({ username, email });
    // const registeredUser = await User.register(user, password);
    // req.flash("success", "Welcome to YelpCamp!");

    // res.redirect("/campgrounds");
  }),
);

module.exports = router;
