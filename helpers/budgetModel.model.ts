import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure that userId is required
    },
    category: {
      type: String,
      required: [true, "Please enter category"],
      trim: true, // Remove whitespace
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount"],
    },
    currency: {
      type: String,
      enum: ["usd", "pkr", "eur", "inr"],
      required: true, // Ensure currency is required
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const budgetModel = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export default budgetModel;
