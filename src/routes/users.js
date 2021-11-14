const express = require("express");
const router = express.Router();
const passport = require("passport");
const { tryAsync } = require("../utils/tryAsync");
const users = require("../controllers/users")


// Renders New User form
router.get("/register", users.newUserForm);

// Registers a new user
router.post(
  "/register",
  tryAsync(users.createUser)
);

// Renders login page
router.get("/login", users.renderLogin);

// Attempts to login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginUser
);

// Logout user
router.get("/logout", users.logoutUser);

module.exports = router;
