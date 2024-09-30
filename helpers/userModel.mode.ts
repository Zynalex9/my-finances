import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, "Please enter username"],
    },
    username: {
      type: String,
      required: [true, "Please enter username"],
      unique: true,
      trim: true, // Remove whitespace
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true, // Store email in lowercase
      trim: true, // Remove whitespace
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: 6, // Enforce minimum password length
    },
    preferredCurrency: {
      type: String,
      enum: ["usd", "pkr", "eur", "inr"],
      default: "usd", // Set a default preferred currency
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
