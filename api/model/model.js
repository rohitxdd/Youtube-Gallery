const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  videoID: {
    type: String,
    required: [true, "videoID is required"],
  },
});

module.exports = mongoose.model("list", listSchema);