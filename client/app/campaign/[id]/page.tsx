"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Gift,
  Users,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  LogIn,
  ArrowRight,
  Check,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { ParticipantAuth } from "@/components/participant-auth"
import { useAuth } from "@/lib/auth-context"
import React from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CampaignParams {
  id: string;
}

interface CampaignData {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  creatorName: string;
  totalAmount: number;
  currentParticipants: number;
  maxParticipants: number;
  amountPerPerson: number;
  status: string;
  socialRequirements: Array<{
    id: string;
    platform: string;
    action: string;
    profileUrl: string;
    displayName: string;
  }>;
  [key: string]: unknown;
}

export default function CampaignPage({ params }: { params: Promise<CampaignParams> }) {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [visitedTasks, setVisitedTasks] = useState<string[]>([])
  const [taskTimers, setTaskTimers] = useState<Record<string, number>>({})
  const [participantData, setParticipantData] = useState({
    fullName: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasParticipated, setHasParticipated] = useState(false)
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolvedParams, setResolvedParams] = useState<CampaignParams | null>(null)

  // Resolve params
  useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved)
    })
  }, [params])

  const id = resolvedParams?.id;

  const fetchCampaign = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/campaigns/${id}`)
      const data = await response.json()
      if (data.success) {
        setCampaignData(data.campaign)
      } else {
        setCampaignData(null)
      }
    } catch {
      setCampaignData(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCampaign()
  }, [fetchCampaign])

  // Check if user already participated
  useEffect(() => {
    if (
      user &&
      campaignData &&
      (Array.isArray(user.participatedCampaigns) ? user.participatedCampaigns : []).includes(campaignData._id || campaignData.id || '')
    ) {
      setHasParticipated(true)
    }
    if (user) {
      setParticipantData((prev) => ({ ...prev, fullName: user.name }))
    }
  }, [user, campaignData])

  // Timer effect for visited tasks
  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {}

    Object.entries(taskTimers).forEach(([taskId, timeLeft]) => {
      if (timeLeft > 0) {
        intervals[taskId] = setInterval(() => {
          setTaskTimers((prev) => {
            const newTime = prev[taskId] - 1
            if (newTime <= 0) {
              return { ...prev, [taskId]: 0 }
            }
            return { ...prev, [taskId]: newTime }
          })
        }, 1000)
      }
    })

    return () => {
      Object.values(intervals).forEach(clearInterval)
    }
  }, [taskTimers])

  if (loading || !resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  // If campaign not found, show error
  if (!campaignData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-0 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
            <p className="text-gray-600 mb-6">The giveaway you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/giveaways">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Browse Other Giveaways
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
  }

  const handleVisitTask = (taskId: string, url: string) => {
    // Open the URL
    window.open(url, "_blank")

    // Mark as visited and start timer
    if (!visitedTasks.includes(taskId)) {
      setVisitedTasks([...visitedTasks, taskId])
      setTaskTimers((prev) => ({ ...prev, [taskId]: 7 }))
    }
  }

  const handleTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId])
    }
  }

  const handleTaskIncomplete = (taskId: string) => {
    setCompletedTasks(completedTasks.filter((id) => id !== taskId))
  }

  const canMarkTaskDone = (taskId: string) => {
    return visitedTasks.includes(taskId) && (taskTimers[taskId] === undefined || taskTimers[taskId] <= 0)
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return completedTasks.length === campaignData.socialRequirements.length
      case 2:
        return (
          participantData.fullName &&
          participantData.phoneNumber &&
          participantData.bankName &&
          participantData.accountNumber &&
          participantData.accountName
        )
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/participants/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: participantData.fullName,
          phoneNumber: participantData.phoneNumber,
          bankName: participantData.bankName,
          accountNumber: participantData.accountNumber,
          accountName: participantData.accountName,
          hasFollowed: true // or derive from task completion if needed
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join giveaway');
      }
      setHasParticipated(true);
      await fetchCampaign(); // Refresh campaign data after joining
    } catch (error) {
      const errorMessage = typeof error === 'object' && error && 'message' in error ? (error as Error).message : 'Failed to join giveaway.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Defensive helpers
  const safeNumber = (val: unknown, fallback = 0) => (typeof val === 'number' && !isNaN(val) ? val : fallback)
  const safeString = (val: unknown, fallback = '') => (typeof val === 'string' ? val : fallback)
  const safeArray = (val: unknown, fallback: unknown[] = []) => (Array.isArray(val) ? val : fallback)

  const progressPercentage = campaignData && safeNumber(campaignData.maxParticipants) > 0
    ? (safeNumber(campaignData.currentParticipants) / safeNumber(campaignData.maxParticipants)) * 100
    : 0

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: "📷",
      twitter: "🐦",
      youtube: "📺",
      facebook: "📘",
      tiktok: "🎵",
      linkedin: "💼",
    }
    return icons[platform as keyof typeof icons] || "🌐"
  }

  const getActionText = (action: string) => {
    const actions = {
      follow: "Follow",
      like: "Like",
      subscribe: "Subscribe",
      join: "Join",
    }
    return actions[action as keyof typeof actions] || action
  }

  if (showAuth) {
    return <ParticipantAuth onSuccess={handleAuthSuccess} onCancel={() => setShowAuth(false)} />
  }

  if (hasParticipated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Already Participated! 🎉</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              You&apos;ve already joined this giveaway. Funds will be distributed automatically when the campaign ends.
            </p>
            <div className="space-y-3">
              <Link href="/giveaways">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Discover More Giveaways
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/giveaways" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Giftways
                </span>
                <div className="text-xs text-gray-500">Giveaway Campaign</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {/* Back Arrow */}
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuth(true)}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Participate
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Campaign Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-3">{safeString(campaignData.title, 'Untitled Campaign')}</CardTitle>
                    <CardDescription className="text-lg text-gray-600 leading-relaxed">
                      {safeString(campaignData.description, 'No description provided.')}
                    </CardDescription>
                    <div className="mt-3 text-sm text-gray-500">
                      Created by <span className="font-medium text-gray-700">{safeString(campaignData.creatorName, 'Unknown')}</span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-3 py-1"
                  >
                    {safeString(campaignData.status, 'Active')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <div className="text-3xl font-bold text-purple-900 mb-1">
                      ₦{safeNumber(campaignData.totalAmount).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Prize Pool</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <div className="text-3xl font-bold text-emerald-900 mb-1">₦{safeNumber(campaignData.amountPerPerson)}</div>
                    <div className="text-sm text-gray-600 font-medium">Per Winner</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-700 font-medium">Participation Progress</span>
                    <span className="font-semibold text-gray-900">
                      {safeNumber(campaignData.currentParticipants)} of {safeNumber(campaignData.maxParticipants)} spots filled
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="text-sm text-gray-600 text-center">
                    {safeNumber(campaignData.maxParticipants) - safeNumber(campaignData.currentParticipants)} spots remaining
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step-by-Step Participation */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
                <Users className="w-6 h-6 text-purple-600" />
                Join This Giveaway
              </CardTitle>
              <CardDescription className="text-base">
                Complete the steps below to participate in this giveaway
              </CardDescription>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <div className={`h-0.5 w-12 ${currentStep >= 2 ? "bg-purple-600" : "bg-gray-200"}`} />
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <div className={`h-0.5 w-12 ${currentStep >= 3 ? "bg-purple-600" : "bg-gray-200"}`} />
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 3 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {!user ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
                  <p className="text-gray-600 mb-6">Sign in or create an account to participate in this giveaway</p>
                  <Button
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In / Sign Up
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Step 1: Complete Tasks */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Complete Social Media Tasks</h3>
                      </div>

                      <div className="space-y-3">
                        {safeArray(campaignData.socialRequirements).map((requirement, index) => (
                          <div
                            key={requirement.id || `requirement-${index}`}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              completedTasks.includes(requirement.id || `requirement-${index}`)
                                ? "border-green-200 bg-green-50"
                                : visitedTasks.includes(requirement.id || `requirement-${index}`)
                                  ? "border-blue-200 bg-blue-50"
                                  : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{getPlatformIcon(requirement.platform)}</span>
                                <div>
                                  <div className="font-medium">
                                    {getActionText(requirement.action)} {requirement.displayName}
                                  </div>
                                  <div className="text-sm text-gray-600 capitalize">on {requirement.platform}</div>
                                  {visitedTasks.includes(requirement.id || `requirement-${index}`) && taskTimers[requirement.id || `requirement-${index}`] > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                      <Clock className="w-3 h-3" />
                                      Wait {taskTimers[requirement.id || `requirement-${index}`]}s to mark as done
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVisitTask(requirement.id || `requirement-${index}`, requirement.profileUrl)}
                                  className={
                                    visitedTasks.includes(requirement.id || `requirement-${index}`) ? "border-blue-500 text-blue-600" : ""
                                  }
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  {visitedTasks.includes(requirement.id || `requirement-${index}`) ? "Visited" : "Visit"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant={completedTasks.includes(requirement.id || `requirement-${index}`) ? "default" : "outline"}
                                  onClick={() =>
                                    completedTasks.includes(requirement.id || `requirement-${index}`)
                                      ? handleTaskIncomplete(requirement.id || `requirement-${index}`)
                                      : handleTaskComplete(requirement.id || `requirement-${index}`)
                                  }
                                  disabled={!canMarkTaskDone(requirement.id || `requirement-${index}`)}
                                  className={
                                    completedTasks.includes(requirement.id || `requirement-${index}`)
                                      ? "bg-green-600 hover:bg-green-700"
                                      : !canMarkTaskDone(requirement.id || `requirement-${index}`)
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                  }
                                >
                                  {completedTasks.includes(requirement.id || `requirement-${index}`) ? (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Done
                                    </>
                                  ) : taskTimers[requirement.id || `requirement-${index}`] > 0 ? (
                                    <>
                                      <Clock className="w-4 h-4 mr-1" />
                                      {taskTimers[requirement.id || `requirement-${index}`]}s
                                    </>
                                  ) : (
                                    "Mark Done"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between pt-4">
                        <Link href="/giveaways">
                          <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Exit Giveaway
                          </Button>
                        </Link>
                        <Button
                          onClick={() => setCurrentStep(2)}
                          disabled={!canProceedToNextStep()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Next Step
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Bank Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Enter Bank Details</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-base font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name as it appears on your bank account"
                            value={participantData.fullName}
                            onChange={(e) => setParticipantData({ ...participantData, fullName: e.target.value })}
                            className="h-12 text-base"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-base font-medium">
                            Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            placeholder="08012345678"
                            value={participantData.phoneNumber}
                            onChange={(e) => setParticipantData({ ...participantData, phoneNumber: e.target.value })}
                            className="h-12 text-base"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bankName" className="text-base font-medium">
                            Bank Name
                          </Label>
                          <Select
                            value={participantData.bankName}
                            onValueChange={(value) => setParticipantData({ ...participantData, bankName: value })}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gtbank">GTBank</SelectItem>
                              <SelectItem value="access">Access Bank</SelectItem>
                              <SelectItem value="zenith">Zenith Bank</SelectItem>
                              <SelectItem value="uba">UBA</SelectItem>
                              <SelectItem value="firstbank">First Bank</SelectItem>
                              <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                              <SelectItem value="sterling">Sterling Bank</SelectItem>
                              <SelectItem value="union">Union Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accountNumber" className="text-base font-medium">
                            Account Number
                          </Label>
                          <Input
                            id="accountNumber"
                            placeholder="1234567890"
                            value={participantData.accountNumber}
                            onChange={(e) => setParticipantData({ ...participantData, accountNumber: e.target.value })}
                            className="h-12 text-base"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accountName" className="text-base font-medium">
                            Account Name
                          </Label>
                          <Input
                            id="accountName"
                            placeholder="Account holder name (as it appears on your bank account)"
                            value={participantData.accountName}
                            onChange={(e) => setParticipantData({ ...participantData, accountName: e.target.value })}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button onClick={() => setCurrentStep(1)} variant="outline">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(3)}
                          disabled={!canProceedToNextStep()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Review & Submit
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
                      </div>

                      <div className="space-y-4">
                        <Card className="bg-blue-50 border-blue-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-blue-900">Completed Tasks</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {safeArray(campaignData.socialRequirements).map((requirement, index) => (
                              <div key={requirement.id || `requirement-${index}`} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-700">
                                  {getActionText(requirement.action)} {requirement.displayName} on{" "}
                                  {requirement.platform}
                                </span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-purple-900">Bank Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Full Name:</span>
                              <span className="font-medium">{participantData.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{participantData.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank:</span>
                              <span className="font-medium capitalize">{participantData.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Number:</span>
                              <span className="font-medium">{participantData.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Name:</span>
                              <span className="font-medium">{participantData.accountName}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div className="text-sm text-amber-800">
                              <p className="font-medium mb-1">Important Notice:</p>
                              <p>
                                By submitting this form, you confirm that you have completed all the required social
                                media tasks and that all information provided is accurate. Providing false information
                                may result in disqualification.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button onClick={() => setCurrentStep(2)} variant="outline">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Submitting...
                            </div>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Submit Entry
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
