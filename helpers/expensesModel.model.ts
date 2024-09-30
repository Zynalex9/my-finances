import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema(
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
    spendingDate: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const expensesModel = mongoose.models.Expense || mongoose.model("Expense", expensesSchema);
export default expensesModel;
