const express = require("express");
const router = express.Router();
const campground = require("../controllers/campgrounds");
// const Campground = require("../models/campgrounds");
const { getData } = require("../utils/unsplash");
const { tryAsync } = require("../utils/tryAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const { route } = require("./users");

router
  .route("/")
  // Home page
  .get(tryAsync(campground.index))
  // Submits new campground
  .post(
    isLoggedIn,
    validateCampground,
    tryAsync(campground.submitNewCampground)
  );

// Returns form for new campground
router.get("/new", isLoggedIn, campground.newCampground);

router
  .route("/:id")
  // Edit campground
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    tryAsync(campground.submitEditCampground)
  )
  // Delete campground
  .delete(isLoggedIn, isAuthor, tryAsync(campground.deleteCampground))
  // Show a specific campground
  .get(tryAsync(campground.showCampground));

// Renders campground edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  tryAsync(campground.editCampground)
);

module.exports = router;
