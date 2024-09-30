import mongoose from "mongoose";

const savingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  goal: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
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
  deadline: {
    type: Date,
    required: true,
  },
});

const savingModel = mongoose.models.Saving || mongoose.model("Saving", savingSchema);
export default savingModel;
