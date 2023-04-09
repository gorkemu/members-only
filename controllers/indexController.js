const Message = require("../models/messageModel");

exports.index = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .populate("user")
      .sort({ timestamp: -1 })
      .exec();
    res.render("index", { title: "Members Only", messages: messages });
  } catch (err) {
    return next(err);
  }
};
