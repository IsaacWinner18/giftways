const express = require("express");
const router = express.Router();
const Giveaway = require("../models/giveaway");
const User = require("../models/user");

// Create a new campaign
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      creatorId,
      creatorName,
      socialRequirements,
      totalAmount,
      maxParticipants,
      beneficiaries,
      distributionRule,
      timeLimit,
    } = req.body;

    // Validation
    if (
      !title ||
      !creatorId ||
      !creatorName ||
      !socialRequirements ||
      !totalAmount ||
      !distributionRule
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (totalAmount < 2000) {
      return res.status(400).json({ error: "Minimum total amount is ₦2,000" });
    }
    if (!["equal", "order", "random"].includes(distributionRule)) {
      return res.status(400).json({ error: "Invalid distribution rule" });
    }
    const minPerPerson = 1000;
    const maxBeneficiaries = Math.floor(totalAmount / minPerPerson);

    if (distributionRule === "equal") {
      if (!maxParticipants)
        return res.status(400).json({ error: "Max participants required" });
      if (maxParticipants < 2 || maxParticipants > maxBeneficiaries) {
        return res.status(400).json({
          error: `Max participants must be between 2 and ${maxBeneficiaries}`,
        });
      }
    }
    if (distributionRule === "order" || distributionRule === "random") {
      if (!beneficiaries)
        return res
          .status(400)
          .json({ error: "Number of beneficiaries required" });
      if (beneficiaries < 2 || beneficiaries > maxBeneficiaries) {
        return res.status(400).json({
          error: `Beneficiaries must be between 2 and ${maxBeneficiaries}`,
        });
      }
      if (distributionRule === "random") {
        if (!maxParticipants)
          return res.status(400).json({ error: "Max participants required" });
        if (
          maxParticipants < beneficiaries ||
          maxParticipants > beneficiaries * 3
        ) {
          return res.status(400).json({
            error: `Max participants must be between ${beneficiaries} and ${
              beneficiaries * 3
            }`,
          });
        }
      }
    }

    const amountPerPerson = Math.floor(
      totalAmount /
        (distributionRule === "equal" ? maxParticipants : beneficiaries)
    );

    const giveaway = new Giveaway({
      title,
      description,
      creatorId,
      creatorName,
      socialRequirements,
      totalAmount,
      maxParticipants,
      beneficiaries,
      distributionRule,
      timeLimit,
      amountPerPerson,
    });
    await giveaway.save();
    // Add campaignUrl to the response
    const campaignObj = giveaway.toObject();
    campaignObj.campaignUrl = `/campaign/${giveaway._id}`;
    res.status(201).json({ success: true, campaign: campaignObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Giveaway.find().sort({ createdAt: -1 });
    // For each campaign, count participants and add currentParticipants
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (campaign) => {
        // Count users who have participated in this campaign
        const currentParticipants = await User.countDocuments({
          participatedCampaigns: campaign._id.toString(),
        });
        const campaignObj = campaign.toObject();
        campaignObj.currentParticipants = currentParticipants;
        return campaignObj;
      })
    );
    res.json({ success: true, campaigns: campaignsWithCounts });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Giveaway.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    // Count participants for this campaign
    const currentParticipants = await User.countDocuments({
      participatedCampaigns: campaign._id.toString(),
    });
    const campaignObj = campaign.toObject();
    campaignObj.currentParticipants = currentParticipants;
    res.json({ success: true, campaign: campaignObj });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add participant to campaign
router.post("/:id/participants", async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      bankName,
      accountNumber,
      accountName,
      email,
    } = req.body;
    const campaignId = req.params.id;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email is required to join campaign" });
    }
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      // Optionally, create user if not found (or return error)
      return res
        .status(404)
        .json({ error: "User not found. Please register or login." });
    }
    // Find campaign
    const campaign = await Giveaway.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    // Count current participants
    let currentParticipants = await User.countDocuments({
      participatedCampaigns: campaignId,
    });
    const maxParticipants = campaign.maxParticipants || 0;
    const remainingParticipants = Math.max(
      maxParticipants - currentParticipants,
      0
    );

    // Prevent joining if max participants reached
    if (currentParticipants >= maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Maximum number of participants reached.",
        currentParticipants,
        maxParticipants,
        remainingParticipants,
      });
    }

    // Check if already joined
    if (user.participatedCampaigns.includes(campaignId)) {
      return res.status(200).json({
        success: false,
        message: "You have already joined this giveaway.",
        currentParticipants,
        maxParticipants,
        remainingParticipants,
      });
    }

    // Add campaign to user's participatedCampaigns
    user.participatedCampaigns.push(campaignId);
    // Optionally update user info
    user.name = fullName || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.bankName = bankName || user.bankName;
    user.accountNumber = accountNumber || user.accountNumber;
    user.accountName = accountName || user.accountName;
    await user.save();

    // Recount after successful join
    const updatedParticipants = await User.countDocuments({
      participatedCampaigns: campaignId,
    });
    const updatedRemaining = Math.max(maxParticipants - updatedParticipants, 0);

    // If max participants reached (after this join), distribute funds
    if (updatedParticipants === maxParticipants) {
      // Get all users who joined this campaign
      const participantUsers = await User.find({
        participatedCampaigns: campaignId,
      });
      let winners = [];
      let amountPerWinner = 0;
      if (campaign.distributionRule === "equal") {
        winners = participantUsers;
        amountPerWinner = campaign.amountPerPerson;
      } else if (campaign.distributionRule === "order") {
        // First N beneficiaries
        winners = participantUsers.slice(0, campaign.beneficiaries);
        amountPerWinner = Math.floor(
          campaign.totalAmount / campaign.beneficiaries
        );
      } else if (campaign.distributionRule === "random") {
        // Randomly select N beneficiaries
        const shuffled = participantUsers.sort(() => 0.5 - Math.random());
        winners = shuffled.slice(0, campaign.beneficiaries);
        amountPerWinner = Math.floor(
          campaign.totalAmount / campaign.beneficiaries
        );
      }
      // Update each winner's balance
      for (const winner of winners) {
        winner.balance = (winner.balance || 0) + amountPerWinner;
        await winner.save();
      }
      // Mark campaign as completed
      campaign.status = "completed";
      await campaign.save();
    }

    return res.json({
      success: true,
      message: "Successfully joined giveaway!",
      currentParticipants: updatedParticipants,
      maxParticipants,
      remainingParticipants: updatedRemaining,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
