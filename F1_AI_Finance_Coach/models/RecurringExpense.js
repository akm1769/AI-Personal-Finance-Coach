const mongoose = require("mongoose");

const recurringExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: { type: String, required: true, trim: true },
    averageAmount: { type: Number, required: true },
    occurrences: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "unknown"],
      default: "unknown"
    },
    lastSeen: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecurringExpense", recurringExpenseSchema);
