const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  //   firstName: { type: String, required: true, maxLength: 25 },
  //   lastName: { type: String, required: true, maxLength: 25 },
  username: { type: String, required: true, maxLength: 25 },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

// Virtual for user's full name
UserSchema.virtual("fullname").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
