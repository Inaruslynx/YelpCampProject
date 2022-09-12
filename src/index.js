const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
// const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
// const helmet = require("helmet");
const {helmetSettings} = require("./utils/helmet");
const User = require("./models/users");
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
// app.use(morgan("dev"));
app.use(express.static(path.join(__dirname + "/public"))); // __dirname is very important
app.use(mongoSanitize());

app.use(
  helmetSettings
);

const store = MongoStore.create({
  mongoUrl: uri,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: process.env.SESSION_SECRET
  }
});

store.on("error", function (err) {
  console.log("Store Session Error", err);
})

// Settings for Session cookies
const sessionConfig = {
  store,
  name: "Yelpcamp user",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    //                    ms     s    m    h    d
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // secure: true,
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

// Tell Express to use routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Go to home
app.get("/", (req, res) => {
  res.render("home");
});

// If route wasn't found above then return an error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// If server has a problem (not an invalid route) then return an error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// Start listening for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
