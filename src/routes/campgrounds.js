const express = require("express");
const router = express.Router();
const campground = require("../controllers/campgrounds");
// const Campground = require("../models/campgrounds");
const { getData } = require("../utils/unsplash");
const { tryAsync } = require("../utils/tryAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Home page
router.get("/", tryAsync(campground.index));

// Returns form for new campground
router.get("/new", isLoggedIn, campground.newCampground);

// Submits new campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  tryAsync(campground.submitNewCampground)
);

// Edit campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  tryAsync(campground.submitEditCampground)
);

// Delete campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  tryAsync(campground.deleteCampground)
);

// Show a specific campground
router.get("/:id", tryAsync(campground.showCampground));

// Renders campground edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  tryAsync(campground.editCampground)
);

module.exports = router;
