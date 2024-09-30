import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure that userId is required
    },
    source: {
      type: String,
      required: [true, "Please enter a source"],
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
    date: { // Changed 'Date' to 'date' for clarity
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const incomeModel = mongoose.models.Income || mongoose.model("Income", incomeSchema);
export default incomeModel;
