const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");

exports.become_member_get = (req, res, next) => {
  if (!res.locals.currentUser) res.redirect("/login");
  res.render("become-member", { title: "Become Member", errors: false });
};

exports.become_member_post = [
  body("member_code", "Member code is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("become-member", {
        title: "Become Member",
        errors: errors.array(),
      });
      return;
    }
    try {
      const user = await User.findById(req.user._id);
      if (req.body.member_code === process.env.MEMBER_CODE) {
        user.member = true;
        await user.save();
        res.redirect("/");
      } else {
        res.render("become-member", {
          title: "Become Member",
          errors: [
            { msg: "Incorrect code. Try something simple (i.e. 'secretcode')" },
          ],
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];
