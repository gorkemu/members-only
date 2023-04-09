const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up", { title: "Sign Up" });
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
