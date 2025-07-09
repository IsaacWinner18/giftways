const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  phoneNumber: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  accountName: { type: String },
  hasFollowed: { type: Boolean, default: false },
  payoutStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  payoutReference: { type: String, default: null },
  amountReceived: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  participatedCampaigns: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Giveaway" },
  ],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
