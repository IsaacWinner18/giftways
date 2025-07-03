const express = require('express');
const router = express.Router();
const Giveaway = require('../models/giveaway');

// Create a new campaign
router.post('/', async (req, res) => {
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
    if (!title || !creatorId || !creatorName || !socialRequirements || !totalAmount || !distributionRule) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (totalAmount < 2000) {
      return res.status(400).json({ error: 'Minimum total amount is ₦2,000' });
    }
    if (!['equal', 'order', 'random'].includes(distributionRule)) {
      return res.status(400).json({ error: 'Invalid distribution rule' });
    }
    const minPerPerson = 1000;
    const maxBeneficiaries = Math.floor(totalAmount / minPerPerson);

    if (distributionRule === 'equal') {
      if (!maxParticipants) return res.status(400).json({ error: 'Max participants required' });
      if (maxParticipants < 2 || maxParticipants > maxBeneficiaries) {
        return res.status(400).json({ error: `Max participants must be between 2 and ${maxBeneficiaries}` });
      }
    }
    if (distributionRule === 'order' || distributionRule === 'random') {
      if (!beneficiaries) return res.status(400).json({ error: 'Number of beneficiaries required' });
      if (beneficiaries < 2 || beneficiaries > maxBeneficiaries) {
        return res.status(400).json({ error: `Beneficiaries must be between 2 and ${maxBeneficiaries}` });
      }
      if (distributionRule === 'random') {
        if (!maxParticipants) return res.status(400).json({ error: 'Max participants required' });
        if (maxParticipants < beneficiaries || maxParticipants > beneficiaries * 3) {
          return res.status(400).json({ error: `Max participants must be between ${beneficiaries} and ${beneficiaries * 3}` });
        }
      }
    }

    const amountPerPerson = Math.floor(totalAmount / (distributionRule === 'equal' ? maxParticipants : beneficiaries));

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
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Giveaway.find().sort({ createdAt: -1 });
    const Participant = require('../models/participant');
    // For each campaign, count participants and add currentParticipants
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (campaign) => {
        const currentParticipants = await Participant.countDocuments({ campaignId: campaign._id.toString() });
        const campaignObj = campaign.toObject();
        campaignObj.currentParticipants = currentParticipants;
        return campaignObj;
      })
    );
    res.json({ success: true, campaigns: campaignsWithCounts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Giveaway.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    // Count participants for this campaign
    const Participant = require('../models/participant');
    const currentParticipants = await Participant.countDocuments({ campaignId: campaign._id.toString() });
    const campaignObj = campaign.toObject();
    campaignObj.currentParticipants = currentParticipants;
    res.json({ success: true, campaign: campaignObj });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 