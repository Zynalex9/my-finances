import mongoose from "mongoose";
import expensesModel from "./expensesModel.model";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure that userId is required
    },
    category: {
      type: String,
      required: [true, "Please enter category"], // e.g., "food", "rent"
      trim: true, // Remove whitespace
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount"], // Total budgeted amount for this category
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
  },
  { timestamps: true }
);

// Method to calculate remaining amount based on expenses of the same category
budgetSchema.methods.calculateRemainingAmount = async function () {
  // Fetch all expenses that belong to this budget category
  const expenses = await expensesModel.find({
    userId: this.userId, // Ensure expenses belong to the same user
    category: this.category, // Match category, e.g., "food" expenses for "food" budget
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Remaining amount = budgeted amount - total expenses in this category
  return this.amount - totalExpenses;
};

const budgetModel = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export default budgetModel;
