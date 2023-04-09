const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true, maxLength: 1000 },
  timestamp: { type: Date, required: true, default: Date.now },
});

// Virtual for formatted timestamp
MessageSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate(); // format 'YYYY-MM-DD'
});

// Virtual for date ago
MessageSchema.virtual("timestamp_ago").get(function () {
  return DateTime.fromJSDate(this.timestamp).toRelative(); // format '2 days ago'
});

module.exports = mongoose.model("Message", MessageSchema);
