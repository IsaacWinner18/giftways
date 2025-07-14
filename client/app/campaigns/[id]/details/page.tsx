"use client";

import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Gift,
  ArrowLeft,
  Users,
  DollarSign,
  ExternalLink,
  Download,
  BarChart3,
  Settings,
  Eye,
  Copy,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CAMPAIGN_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface CampaignData {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  totalAmount: number;
  maxParticipants: number;
  currentParticipants: number;
  amountPerPerson: number;
  status: string;
  createdAt: string;
  campaignUrl: string;
  socialRequirements: Array<{
    id: string;
    platform: string;
    action: string;
    profileUrl: string;
    displayName: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: string;
  bankDetails: string;
}

export default function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  // Resolve params
  useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/campaigns/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setCampaign(data.campaign);
        } else {
          setCampaign(null);
        }
      } catch {
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [resolvedParams]);

  useEffect(() => {
    if (!resolvedParams) return;
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${API_URL}/users?campaignId=${resolvedParams.id}`
        );
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [resolvedParams]);

  const handleCopyUrl = () => {
    if (campaign) {
      const campaignLink = `${CAMPAIGN_URL}/${campaign._id}`;
      navigator.clipboard.writeText(campaignLink);
      alert("Campaign URL copied to clipboard!");
    }
  };

  const handleExportParticipants = () => {
    alert("Exporting participants data...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || !resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-0 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Campaign Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The giveaway you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Link href="/campaigns">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Browse Other Campaigns
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/campaigns">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`${CAMPAIGN_URL}/${campaign._id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit URL
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Campaign Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Prize
                  </p>
                  <p className="text-2xl font-bold">
                    ₦{campaign.totalAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Participants
                  </p>
                  <p className="text-2xl font-bold">
                    {campaign.currentParticipants}/{campaign.maxParticipants}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">
                    Per Winner
                  </p>
                  <p className="text-2xl font-bold">
                    ₦{campaign.amountPerPerson}
                  </p>
                </div>
                <Gift className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Completion
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (campaign.currentParticipants /
                        campaign.maxParticipants) *
                        100
                    )}
                    %
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Campaign Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Title
                    </Label>
                    <p className="text-lg font-semibold">{campaign.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Description
                    </Label>
                    <p className="text-gray-700">{campaign.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <Badge className="mt-1 capitalize">
                        {campaign.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Created
                      </Label>
                      <p className="text-gray-700">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Social Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {campaign.socialRequirements &&
                  campaign.socialRequirements.length > 0 ? (
                    campaign.socialRequirements.map((req, index) => (
                      <div
                        key={req.id || `req-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {req.action} {req.displayName}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            on {req.platform}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(req.profileUrl, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No social requirements configured for this campaign.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Participants</span>
                    <span>
                      {campaign.currentParticipants} of{" "}
                      {campaign.maxParticipants}
                    </span>
                  </div>
                  <Progress
                    value={
                      (campaign.currentParticipants /
                        campaign.maxParticipants) *
                      100
                    }
                    className="h-3"
                  />
                  <div className="text-center text-sm text-gray-600">
                    {campaign.maxParticipants - campaign.currentParticipants}{" "}
                    spots remaining
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Participants ({users.length})</CardTitle>
                    <CardDescription>
                      Manage campaign participants and their verification status
                    </CardDescription>
                  </div>
                  <Button onClick={handleExportParticipants} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user, index) => (
                        <TableRow key={user.id || `user-${index}`}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.joinedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{user.bankDetails}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          No participants have joined this campaign yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Total Participants
                        </p>
                        <p className="text-3xl font-bold">
                          {campaign.currentParticipants}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-blue-200" />
                          <p className="text-blue-200 text-xs">
                            of {campaign.maxParticipants} max
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Completion Rate
                        </p>
                        <p className="text-3xl font-bold">
                          {Math.round(
                            (campaign.currentParticipants /
                              campaign.maxParticipants) *
                              100
                          )}
                          %
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Target className="w-3 h-3 text-emerald-200" />
                          <p className="text-emerald-200 text-xs">
                            Campaign progress
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">
                          Total Value
                        </p>
                        <p className="text-3xl font-bold">
                          ₦{campaign.totalAmount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="w-3 h-3 text-purple-200" />
                          <p className="text-purple-200 text-xs">
                            ₦{campaign.amountPerPerson.toLocaleString()} per
                            person
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">
                          Remaining Spots
                        </p>
                        <p className="text-3xl font-bold">
                          {campaign.maxParticipants -
                            campaign.currentParticipants}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="w-3 h-3 text-orange-200" />
                          <p className="text-orange-200 text-xs">
                            Available positions
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Performance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Platform Performance
                  </CardTitle>
                  <CardDescription>
                    Social platforms used in this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.socialRequirements &&
                  campaign.socialRequirements.length > 0 ? (
                    campaign.socialRequirements.map((req, index) => (
                      <div key={req.id || `req-${index}`} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-pink-500"
                                  : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                  ? "bg-gray-800"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="font-medium capitalize">
                              {req.platform}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold capitalize">
                              {req.action}
                            </div>
                            <div className="text-sm text-gray-600">
                              {req.displayName}
                            </div>
                          </div>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No platform data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Campaign Progress */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Campaign Progress</CardTitle>
                  <CardDescription>
                    Visual representation of campaign completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Participants</span>
                      <span>
                        {campaign.currentParticipants} of{" "}
                        {campaign.maxParticipants}
                      </span>
                    </div>
                    <Progress
                      value={
                        (campaign.currentParticipants /
                          campaign.maxParticipants) *
                        100
                      }
                      className="h-3"
                    />
                    <div className="text-center text-sm text-gray-600">
                      {campaign.maxParticipants - campaign.currentParticipants}{" "}
                      spots remaining
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
                <CardDescription>
                  Manage your campaign configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Settings Panel
                  </h3>
                  <p className="text-gray-600">
                    Campaign settings and configuration options will be
                    available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
