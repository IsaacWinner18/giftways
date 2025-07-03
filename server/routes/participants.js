const express = require('express');
const router = express.Router();
const Participant = require('../models/participant');
const Giveaway = require('../models/giveaway');

// Join a campaign
router.post('/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const {
      fullName,
      phoneNumber,
      bankName,
      accountNumber,
      accountName,
      hasFollowed,
    } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !bankName || !accountNumber || !accountName || typeof hasFollowed !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check campaign exists
    const campaign = await Giveaway.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (campaign.status !== 'active') return res.status(400).json({ error: 'Campaign is not active' });

    // Check participant limits
    const participantCount = await Participant.countDocuments({ campaignId });
    if (campaign.maxParticipants && participantCount >= campaign.maxParticipants) {
      return res.status(400).json({ error: 'Campaign is full' });
    }

    // Check if already joined (by phone/account)
    const alreadyJoined = await Participant.findOne({ campaignId, phoneNumber });
    if (alreadyJoined) {
      return res.status(400).json({ error: 'You have already joined this campaign' });
    }

    const participant = new Participant({
      campaignId,
      fullName,
      phoneNumber,
      bankName,
      accountNumber,
      accountName,
      hasFollowed,
    });
    await participant.save();
    res.status(201).json({ success: true, participant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get participants for a campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const participants = await Participant.find({ campaignId });
    res.json({ success: true, participants });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 