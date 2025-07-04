const express = require('express');
const router = express.Router();
const Giveaway = require('../models/giveaway');
const Participant = require('../models/participant');

// Get analytics data for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all campaigns for the user
    const campaigns = await Giveaway.find({ creatorId: userId }).sort({ createdAt: -1 });
    
    if (campaigns.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalRevenue: 0,
          totalParticipants: 0,
          conversionRate: 0,
          avgCampaignValue: 0,
          monthlyGrowth: 0,
          topPlatforms: [],
          recentPerformance: [],
          totalCampaigns: 0,
          activeCampaigns: 0,
          completedCampaigns: 0
        }
      });
    }

    // Calculate total revenue
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.totalAmount, 0);
    
    // Get all participants for user's campaigns
    const campaignIds = campaigns.map(campaign => campaign._id.toString());
    const participants = await Participant.find({ campaignId: { $in: campaignIds } });
    
    const totalParticipants = participants.length;
    const avgCampaignValue = Math.round(totalRevenue / campaigns.length);
    
    // Calculate conversion rate (followers to participants)
    const totalFollowers = participants.filter(p => p.hasFollowed).length;
    const conversionRate = totalParticipants > 0 ? Math.round((totalFollowers / totalParticipants) * 100) : 0;
    
    // Calculate monthly growth
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthParticipants = participants.filter(p => {
      const date = new Date(p.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const lastMonthParticipants = participants.filter(p => {
      const date = new Date(p.createdAt);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }).length;
    
    const monthlyGrowth = lastMonthParticipants > 0 
      ? Math.round(((currentMonthParticipants - lastMonthParticipants) / lastMonthParticipants) * 100)
      : currentMonthParticipants > 0 ? 100 : 0;
    
    // Calculate platform performance
    const platformData = {};
    campaigns.forEach(campaign => {
      campaign.socialRequirements.forEach(req => {
        if (!platformData[req.platform]) {
          platformData[req.platform] = 0;
        }
        platformData[req.platform] += 1;
      });
    });
    
    const totalPlatforms = Object.values(platformData).reduce((sum, count) => sum + count, 0);
    const topPlatforms = Object.entries(platformData)
      .map(([name, count]) => ({
        name,
        participants: count,
        percentage: totalPlatforms > 0 ? Math.round((count / totalPlatforms) * 100) : 0
      }))
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 4);
    
    // Calculate monthly performance (last 6 months)
    const monthlyPerformance = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date();
      targetMonth.setMonth(targetMonth.getMonth() - i);
      const month = targetMonth.getMonth();
      const year = targetMonth.getFullYear();
      
      const monthCampaigns = campaigns.filter(campaign => {
        const date = new Date(campaign.createdAt);
        return date.getMonth() === month && date.getFullYear() === year;
      });
      
      const monthParticipants = participants.filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === month && date.getFullYear() === year;
      });
      
      const monthRevenue = monthCampaigns.reduce((sum, campaign) => sum + campaign.totalAmount, 0);
      
      monthlyPerformance.push({
        month: monthNames[month],
        campaigns: monthCampaigns.length,
        participants: monthParticipants.length,
        revenue: monthRevenue
      });
    }
    
    // Campaign status counts
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    
    const analytics = {
      totalRevenue,
      totalParticipants,
      conversionRate,
      avgCampaignValue,
      monthlyGrowth,
      topPlatforms,
      recentPerformance: monthlyPerformance,
      totalCampaigns: campaigns.length,
      activeCampaigns,
      completedCampaigns
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 