if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();
const PORT = process.env.PORT || 3000;

// Models imports
const User = require("./models/user");
const Campground = require("./models/campground");
const Review = require("./models/review");

// Routes Imports
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");

//Mongoose Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => console.log("Conected to DB"))
  .catch((error) => console.log(error));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "secretsession",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 2,
    maxAge: 1000 * 60 * 60 * 24 * 2,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", usersRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

// 404 Middleware
app.all("/{*path}", (req, res, next) => {
  next(new ExpressError("Resource not found", 404));
});

// Error handler middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Something Went Wrong!";

  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
