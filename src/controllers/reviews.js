const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");

// Route for review submission
module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully posted new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Route to delete review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
