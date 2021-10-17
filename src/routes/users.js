const express = require("express");
const router = express.Router();
const tryAsync = require("../utils/tryAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  tryAsync(async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = new User({ username, email });
      const registedUser = await User.register(user, password);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash('error', e.message)
      res.redirect('register')
    }
  })
);

module.exports = router;
