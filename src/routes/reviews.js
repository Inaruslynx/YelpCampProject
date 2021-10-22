const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Campground = require("../models/campgrounds");
const ExpressError = require("../utils/ExpressError");
const { tryAsync } = require("../utils/tryAsync");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Route for review submission
router.post(
  "/",
  validateReview,
  tryAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully posted new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route to delete review
router.delete(
  "/:reviewId",
  tryAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
