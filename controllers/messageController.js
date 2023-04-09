const Message = require("../models/messageModel");
const { body, validationResult } = require("express-validator");

exports.create_message_get = (req, res, next) => {
  if (!res.locals.currentUser) res.redirect("/login");
  res.render("create-message", { title: "Create Message" });
};

exports.create_message_post = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title is required."),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Content is required."),
  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("create-message", {
        title: "Create Message",
        errors: errors.array(),
      });
      return;
    }
    try {
      const message = new Message({
        user: req.user._id,
        title: req.body.title,
        content: req.body.content,
        timestamp: Date.now(),
      });
      await message.save();
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];
