const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");
const User = require("../models/users");

// Renders Home Page
// module.exports.homePage = (req, res) => {
//   res.render('/home');
// }

// Renders New User form
module.exports.newUserForm = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted review!");
  res.redirect(`/campgrounds/${id}`);
};

// Registers a new user
module.exports.createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email });
    const registedUser = await User.register(user, password);
    req.login(registedUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

// Renders login page
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// Attempts to login user
module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome to Yelp Camp!");
  const redirectURL = req.session.returnTo || "/campgrounds";
  res.redirect(redirectURL);
};

// Logout user
module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};
