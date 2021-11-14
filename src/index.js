const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
// const {tryAsync } = require("./utils/tryAsync")
// const { seed } = require("./seed/seed");
// const {addAuthor} = require("./utils/addAuthor")

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

// Log into my MongoDB instance
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.kyfef.mongodb.net/yelp-camp?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// seed(); // This will seed a mongoDB with 50 new camps
// tryAsync(addAuthor()); //This will add authors to campgrounds (campgroundID, authorID) I have a defaultID for a test user

const app = express();

// Sets up Express
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // __dirname is very important
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Remove below when no longer developing
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname + "/public"))); // __dirname is very important

// Settings for Session cookies
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    //                    ms     s    m    h    d
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Setup passport module
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// If there is a success or error message in res, add to req flash message
app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Right now there is no / so redirect to campground
app.get("/", (req, res) => {
  res.redirect("/campgrounds");
});

// Tell Express to use routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// If route wasn't found above then return an error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// If server has a problem (not an invalid route) then return an error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Somethign went wrong!";
  res.status(statusCode).render("error", { err });
});

// Start listening for requests
app.listen(8080, () => {
  console.log("Serving on port 8080");
});
