const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const { tryAsync } = require("../utils/tryAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

// Route for review submission
router.post("/", isLoggedIn, validateReview, tryAsync(reviews.createReview));

// Route to delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  tryAsync(reviews.deleteReview)
);

module.exports = router;
