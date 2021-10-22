const express = require("express");
const router = express.Router();
const passport = require("passport");
const { tryAsync } = require("../utils/tryAsync");
const User = require("../models/user");

// Renders New User form
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Registers a new user
router.post(
  "/register",
  tryAsync(async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = new User({ username, email });
      const registedUser = await User.register(user, password);
      req.login(registedUser, (err) => {
        if (err) return next(err);
      });
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

// Renders login page
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Attempts to login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome to Yelp Camp!");
    res.redirect("/campgrounds");
  }
);

// Logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

module.exports = router;
