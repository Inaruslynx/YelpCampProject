const Campground = require("../models/campgrounds");
const { getData } = require("../utils/unsplash");
// Home page
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// Returns form for new campground
module.exports.newCampground = (req, res) => {
  res.render("campgrounds/new");
};

// Submits new campground
module.exports.submitNewCampground = async (req, res) => {
  let params = req.body.campground;
  const urlArray = params["image"].split("/");
  const photoId = urlArray[urlArray.length - 1];
  const results = await getData(photoId);
  if (results.type === "success") {
    const photo = results.response;
    params["image"] = {
      id: photo.id,
      width: photo.width,
      height: photo.height,
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
    };
    const campground = new Campground(params);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully created new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } else {
    console.log("Error getting photo data");
    console.log(results);
  }
};

// Edit campground
module.exports.submitEditCampground = async (req, res) => {
  let data = req.body.campground;
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (camp.image.urls.raw === data.image) {
    delete data.image;
    await Campground.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  } else {
    let url = data.image.split("/");
    const photoId = url[url.length - 1];
    const results = await getData(photoId);
    if (results.type === "success") {
      const photo = results.response;
      data["image"] = {
        id: photo.id,
        width: photo.width,
        height: photo.height,
        urls: {
          raw: photo.urls.raw,
          full: photo.urls.full,
          regular: photo.urls.regular,
          small: photo.urls.small,
          thumb: photo.urls.thumb,
        },
      };
      await Campground.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
    }
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${id}`);
};

// Delete campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndRemove(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};

// Show a specific campground
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } }) // Populate reviews and their authors
    .populate("author"); // Populate author of campground
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

// Renders campground edit
module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  const url = campground.image.urls.raw;
  res.render(`campgrounds/edit`, { campground, url });
};
