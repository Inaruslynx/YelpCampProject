const express = require("express");
const router = express.Router();
const multer = require("multer");
const {storage, test} = require("../cloudinary")
const upload = multer({ storage });
const campground = require("../controllers/campgrounds");
const { tryAsync } = require("../utils/tryAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Handles all routes to /
router
  .route("/")
  // Home page
  .get(tryAsync(campground.index))
  // Submits new campground
  .post(
    isLoggedIn,
    validateCampground,
    upload.array('file'),
    tryAsync(campground.submitNewCampground)
  );

// Returns form for new campground
router.get("/new", isLoggedIn, campground.newCampground);

// Handles all routes to /:id, must be after /new or it will consider it as an id
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
