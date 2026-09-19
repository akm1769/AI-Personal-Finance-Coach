const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    category: {
      type: String,
      default: "Other",
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    source: {
      type: String,
      enum: ["manual", "imported"],
      default: "manual"
    },
    recurring: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
