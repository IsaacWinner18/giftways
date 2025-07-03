"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Gift, Clock, Hash } from "lucide-react"
import Link from "next/link"

export default function CreateCampaignPage() {
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    socialHandle: "",
    platform: "",
    totalAmount: "",
    maxParticipants: "",
    distributionRule: "count",
    timeLimit: "",
  })

  useEffect(() => {
    // Redirect to dashboard with create tab active
    if (user) {
      window.location.href = "/dashboard?tab=create"
    }
  }, [user])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with Paystack and create the campaign
    console.log("Campaign data:", formData)
    // Redirect to payment or campaign page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-purple-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Giftways
              </span>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Campaign
          </h1>
          <p className="text-gray-600">Set up your giveaway campaign in just a few steps</p>
        </div>

        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Gift className="w-5 h-5" />
              Campaign Details
            </CardTitle>
            <CardDescription>Configure your giveaway campaign settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Christmas Giveaway 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell participants about your giveaway..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Social Media Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Social Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialHandle">Social Handle</Label>
                  <Input
                    id="socialHandle"
                    placeholder="@yourusername"
                    value={formData.socialHandle}
                    onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Amount and Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount (NGN)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="50000"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="100"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Distribution Rules */}
              <div className="space-y-4">
                <Label>Distribution Rule</Label>
                <RadioGroup
                  value={formData.distributionRule}
                  onValueChange={(value) => setFormData({ ...formData, distributionRule: value })}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-purple-50">
                    <RadioGroupItem value="count" id="count" />
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      <Label htmlFor="count" className="cursor-pointer">
                        By Count - Distribute when participant limit is reached
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-purple-50">
                    <RadioGroupItem value="time" id="time" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <Label htmlFor="time" className="cursor-pointer">
                        By Time - Distribute after a specific time period
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Time Limit (if time-based) */}
              {formData.distributionRule === "time" && (
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (Hours)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    placeholder="24"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Summary */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-purple-900 mb-3">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">₦{formData.totalAmount || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Participants:</span>
                      <span className="font-medium">{formData.maxParticipants || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount per Person:</span>
                      <span className="font-medium">
                        ₦
                        {formData.totalAmount && formData.maxParticipants
                          ? Math.floor(Number(formData.totalAmount) / Number(formData.maxParticipants))
                          : "0"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                Proceed to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
