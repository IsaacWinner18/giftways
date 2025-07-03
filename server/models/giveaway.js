const mongoose = require('mongoose');

const socialRequirementSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  action: { type: String, required: true },
  profileUrl: { type: String, required: true },
  displayName: { type: String, required: true },
});

const giveawaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  socialRequirements: [socialRequirementSchema],
  totalAmount: { type: Number, required: true },
  maxParticipants: { type: Number },
  beneficiaries: { type: Number },
  distributionRule: { type: String, enum: ['equal', 'order', 'random'], required: true },
  timeLimit: { type: Number },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  amountPerPerson: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Giveaway = mongoose.model('Giveaway', giveawaySchema);

module.exports = Giveaway; 