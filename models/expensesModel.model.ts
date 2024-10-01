import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget", 
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please enter category"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount"],
    },
    currency: {
      type: String,
      enum: ["usd", "pkr", "eur", "inr"],
      required: true
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
