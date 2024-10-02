import mongoose from "mongoose";
import expensesModel from "./expensesModel.model";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true, // e.g., "food", "rent"
      trim: true,
    },
    amount: {
      type: Number,
      required: true, // Total budgeted amount for this category
    },
    remainingAmount: {
      type: Number, // This will be calculated dynamically
      default: 0, // Initialize with 0, will be updated later
    },
    frequency: {
      type: String, // e.g., "monthly", "weekly", "custom"
      enum: ["monthly", "weekly", "custom"],
      default: "monthly",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: function () {
        return new Date(new Date().setMonth(new Date().getMonth() + 1));
      }, // End date for custom budget; default to 1 month
    },
    currency: {
      type: String,
      enum: ["usd", "pkr", "eur", "inr"],
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate remaining amount based on expenses of the same category
budgetSchema.methods.calculateRemainingAmount = async function () {
  // Fetch all expenses that belong to this budget category
  const expenses = await expensesModel.find({
    userId: this.userId, // Ensure expenses belong to the same user
    category: this.category, // Match category, e.g., "food" expenses for "food" budget
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Update remainingAmount in the budget
  this.remainingAmount = this.amount - totalExpenses;
  await this.save(); // Save the updated budget document

  return this.remainingAmount;
};

const budgetModel = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export default budgetModel;
