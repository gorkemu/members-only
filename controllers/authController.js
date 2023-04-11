const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up", { title: "Sign Up", errors: false });
};

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username is required."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be at least 6 characters long."),
  check("confirmPassword")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .escape()
    .withMessage("Passwords do not match."),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("sign-up", { title: "Sign Up", errors: errors.array() });
      return;
    }
    try {
      const isUsernameAvailable = await User.find({
        username: req.body.username,
      });
      if (isUsernameAvailable.length > 0) {
        res.render("sign-up", {
          title: "Sign Up",
          errors: [{ msg: "Username is already taken." }],
        });
        return;
      }
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          member: false,
          admin: false,
        });
        await user.save();
        res.redirect("/");
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_get = (req, res, next) => {
  if (res.locals.currentUser) return res.redirect("/");
  res.render("login", { title: "Login", errors: false });
};

// exports.login_post = passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
// });
exports.login_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username is required."),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password is required."),
  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("login", { title: "Login", errors: errors.array() });
      return;
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.render("login", {
          title: "Login",
          errors: [{ msg: "Invalid username or password." }],
        });
        return;
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  },
];

exports.logout_get = (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
};

exports.test_login_get = (req, res, next) => {
  res.render("test-login", { title: "Test Login", errors: false });
};

exports.test_login_post = [
  passport.authenticate("local", { failureRedirect: "/test-login" }),
  async (req, res, next) => {
    const user = await User.findOne({ username: "testuser" });
    if (user) {
      user.member = false;
      user.admin = false;
      await user.save();
    } else {
      const user = new User({
        username: "testuser",
        password: "testuser",
        member: false,
        admin: false,
      });
      await user.save();
    }
    res.redirect("/");
  },
];
