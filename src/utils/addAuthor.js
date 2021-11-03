const Campground = require("../models/campgrounds");
const User = require("../models/user");

exports.addAuthor = async (
  campgroundID = "",
  authorID = "616d5ebbafac7e1e52d1aa70" // This is my default userID
) => {
  const user = await User.findById(authorID);
  if (campgroundID) {
    const campground = await Campground.findById(campgroundID);
    campground.author = user;
    await campground.save();
  } else {
    const campgrounds = await Campground.find({});
    for (const campground of campgrounds) {
      if (!campground.author) {
        campground.author = user;
        await campground.save();
      }
    }
  }
};
