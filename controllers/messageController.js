const Message = require("../models/messageModel");
const { body, validationResult } = require("express-validator");

exports.create_message_get = (req, res, next) => {
  if (!res.locals.currentUser) res.redirect("/login");
  res.render("create-message", { title: "Create Message", errors: false });
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
    .isLength({ min: 1, max: 250 })
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

/* User delete message */
exports.user_delete_message_post = async (req, res, next) => {
  if (!res.locals.currentUser) return res.redirect("/login");
  try {
    const message = await Message.findById(req.params.id);
    if (message.user._id.toString() === res.locals.currentUser._id.toString()) {
      await Message.findByIdAndDelete(req.params.id);
    }
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

/* Admin delete message */
exports.admin_delete_message_post = async (req, res, next) => {
  if (!res.locals.currentUser) return res.redirect("/login");
  if (!res.locals.currentUser.admin) return res.redirect("/");
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
