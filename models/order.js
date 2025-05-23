const mongoose = require("mongoose");

const order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user", // ✅ Fixed model name
      required: true,
    },
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books", // ✅ Fixed model name
        required: true,
      },
    ],
    status: {
      type: String,
      default: "order placed",
      enum: ["order placed", "out for delivery", "delivered", "canceled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order); // ✅ Fixed model name
