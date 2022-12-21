const mongoose = require("mongoose");

const refreshSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    userId: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Refresh", refreshSchema, "tokens");
