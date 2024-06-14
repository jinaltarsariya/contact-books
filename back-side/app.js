require("dotenv").config();
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
let session = require("express-session");
const jwt = require("jsonwebtoken");
let passport = require("passport");
let app = express();
require("./Passport"); // Separate file to configure passport

mongoose
  .connect(`${process.env.MONGODB_URL}/Contact-book`)
  .then(() => console.log("Databased connected!"))
  .catch((err) => console.log("error ---> ", err));

let indexRouter = require("./routes/index");
let userRouter = require("./routes/user-route");
const contactRoute = require("./routes/contact-route");

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/contact", contactRoute);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`${process.env.FRONTEND_URL}/contact?token=${token}`);
  }
);

// Error handling middleware
app.use((req, res, next) => {
  res.json({ message: "Not Found" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
