"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Gift,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ExternalLink,
  Edit,
  Trash2,
  Users,
  Calendar,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  creatorName: string;
  status: string;
  socialPlatform?: string;
  totalAmount: number;
  currentParticipants: number;
  maxParticipants: number;
  amountPerPerson: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function CampaignsPage() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${API_URL}/campaigns`)
        const data = await response.json()
        if (data.success) {
          setCampaigns(data.campaigns)
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  useEffect(() => {
    const filtered = campaigns.filter((campaign) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        if (
          !campaign.title.toLowerCase().includes(searchLower) &&
          !campaign.description.toLowerCase().includes(searchLower) &&
          !campaign.creatorName.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== "all" && campaign.status !== statusFilter) {
        return false
      }

      return true
    })

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "highest":
          return b.totalAmount - a.totalAmount
        case "lowest":
          return a.totalAmount - b.totalAmount
        case "participants":
          return b.currentParticipants - a.currentParticipants
        default:
          return 0
      }
    })

    setFilteredCampaigns(filtered)
  }, [campaigns, searchTerm, statusFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCampaignAction = (action: string, campaignId: string) => {
    switch (action) {
      case "edit":
        // Navigate to edit page
        window.location.href = `/campaigns/${campaignId}/edit`
        break
      case "duplicate":
        alert(`Duplicating campaign ${campaignId}`)
        break
      case "pause":
        alert(`Pausing campaign ${campaignId}`)
        break
      case "delete":
        if (confirm("Are you sure you want to delete this campaign?")) {
          alert(`Deleting campaign ${campaignId}`)
        }
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Campaigns...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Giftways
                </span>
                <div className="text-xs text-gray-500">All Campaigns</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/create-campaign">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Create Campaign
                </Button>
              </Link>
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Campaigns</h1>
          <p className="text-gray-600">Manage and monitor all your giveaway campaigns</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Prize</SelectItem>
                  <SelectItem value="lowest">Lowest Prize</SelectItem>
                  <SelectItem value="participants">Most Participants</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first campaign to get started"}
              </p>
              <Link href="/create-campaign">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCampaigns.map((campaign: Campaign) => (
              <Card key={campaign._id || campaign.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {campaign.socialPlatform}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created {new Date(campaign.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {campaign.currentParticipants} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {campaign.creatorName}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCampaignAction("edit", campaign.id || campaign._id || "")}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign.id || campaign._id || "")}>
                          <Gift className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCampaignAction("pause", campaign.id || campaign._id || "")}>
                          <Target className="w-4 h-4 mr-2" />
                          Pause Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCampaignAction("delete", campaign.id || campaign._id || "")}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="text-lg font-bold text-purple-900">₦{campaign.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Total Prize</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-lg font-bold text-blue-900">
                        {campaign.currentParticipants}/{campaign.maxParticipants}
                      </div>
                      <div className="text-xs text-gray-600">Participants</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="text-lg font-bold text-emerald-900">₦{campaign.amountPerPerson}</div>
                      <div className="text-xs text-gray-600">Per Winner</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="text-lg font-bold text-orange-900">
                        {Math.round((campaign.currentParticipants / campaign.maxParticipants) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {campaign.currentParticipants} of {campaign.maxParticipants} participants
                      </span>
                    </div>
                    <Progress value={(campaign.currentParticipants / campaign.maxParticipants) * 100} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/campaign/${campaign.id || campaign._id || ""}`} className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Public Page
                      </Link>
                    </Button>
                    {campaign.status === "active" && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ml-auto"
                      >
                        Manage Campaign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
