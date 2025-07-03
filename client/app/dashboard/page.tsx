"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Plus, Users, TrendingUp, Eye, Download, ExternalLink, DollarSign } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  totalAmount: number;
  currentParticipants: number;
  maxParticipants: number;
  status: string;
  createdAt: string;
  amountPerPerson?: number;
  platform?: string;
  handle?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState({ totalCampaigns: 0, totalDistributed: 0, totalParticipants: 0, activeCampaigns: 0 })

  useEffect(() => {
    if (!user) return;
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${API_URL}/campaigns`);
        const data = await res.json();
        if (data.success) {
          // Only show campaigns created by this user
          console.log("logs from the dashboard", data.campaigns);
          const userCampaigns = data.campaigns.filter(
            (campaign: Campaign) => campaign.creatorId === user?._id || campaign.creatorId === user?.id
          );
          setCampaigns(userCampaigns);
          // Calculate stats
          setStats({
            totalCampaigns: userCampaigns.length,
            totalDistributed: userCampaigns.reduce((sum: number, c: Campaign) => sum + (c.totalAmount || 0), 0),
            totalParticipants: userCampaigns.reduce((sum: number, c: Campaign) => sum + (c.currentParticipants || 0), 0),
            activeCampaigns: userCampaigns.filter((c: Campaign) => c.status === "active").length,
          });
        }
      } catch {
        setCampaigns([]);
      }
    };
    fetchCampaigns();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Giftways
            </span>
          </Link>
          <Link href="/create-campaign">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Creator Dashboard
          </h1>
          <p className="text-gray-600">Manage your giveaway campaigns and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.totalCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Distributed</p>
                  <p className="text-2xl font-bold text-green-900">₦{stats.totalDistributed.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalParticipants}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.activeCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Gift className="w-5 h-5" />
              Your Campaigns
            </CardTitle>
            <CardDescription>Manage and monitor all your giveaway campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No campaigns yet<br />
                <Link href="/create-campaign" className="text-purple-600 underline">Create your first giveaway campaign to get started!</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-purple-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-purple-900">{campaign.title}</h3>
                        <p className="text-sm text-gray-600">
                          Created on {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/campaign/${campaign.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-900">
                          ₦{campaign.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Total Amount</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-900">
                          {campaign.currentParticipants}/{campaign.maxParticipants}
                        </div>
                        <div className="text-xs text-gray-600">Participants</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-900">₦{campaign.amountPerPerson ?? 0}</div>
                        <div className="text-xs text-gray-600">Per Person</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-900">{campaign.platform ?? "-"}</div>
                        <div className="text-xs text-gray-600">{campaign.handle ?? "-"}</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {Math.round((campaign.currentParticipants / campaign.maxParticipants) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(campaign.currentParticipants / campaign.maxParticipants) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      {campaign.status === "active" && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Trigger Payout
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
