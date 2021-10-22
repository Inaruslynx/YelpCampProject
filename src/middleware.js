module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    console.log(req.originalUrl);
    // Something is wrong here
    res.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
