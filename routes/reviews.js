const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundReviewSchema } = require("../schemas");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//Controller
const reviews = require("../controllers/reviews");

//Routes
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview),
);

module.exports = router;
