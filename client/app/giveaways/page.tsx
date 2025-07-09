"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Search, Users, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Giveaway {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  creatorName?: string;
  creator?: string;
  createdAt: string;
  totalAmount: number;
  amountPerPerson?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  status?: string;
  timeRemaining?: string;
  platforms?: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  participatedCampaigns?: string[];
  balance?: number; // Added balance field
}

export default function GiveawaysPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [filteredGiveaways, setFilteredGiveaways] = useState<Giveaway[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGiveaways = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/campaigns`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setGiveaways(data.campaigns);
        } else {
          setGiveaways([]);
          setError(data.error || "Failed to fetch giveaways.");
        }
      } catch (error: unknown) {
        setGiveaways([]);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching giveaways."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGiveaways();

    // Re-fetch on page focus/visibility
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchGiveaways();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const filtered = giveaways.filter((giveaway) => {
      // Remove the filter that hides participated giveaways
      // Search filter only
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          String(giveaway.title).toLowerCase().includes(searchLower) ||
          String(giveaway.description).toLowerCase().includes(searchLower) ||
          String(
            giveaway.creatorName
              ? giveaway.creatorName
              : giveaway.creator
              ? giveaway.creator
              : ""
          )
            .toLowerCase()
            .includes(searchLower)
        );
      }
      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "ending-soon":
          // If you have a timeRemaining field, sort by it, otherwise skip
          return 0;
        case "highest-prize":
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case "most-participants":
          return (b.currentParticipants || 0) - (a.currentParticipants || 0);
        default:
          return 0;
      }
    });
    setFilteredGiveaways(filtered);
  }, [searchTerm, sortBy, user, giveaways]);

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: "📷",
      twitter: "🐦",
      youtube: "📺",
      facebook: "📘",
      tiktok: "🎵",
      linkedin: "💼",
    };
    return icons[platform as keyof typeof icons] || "🌐";
  };

  const getProgressPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Giftways
                </span>
                <div className="text-xs text-gray-500">Discover Giveaways</div>
              </div>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg px-3 py-2 border border-emerald-100">
                  <span className="text-xs text-gray-500">Balance:</span>
                  <span className="text-base font-bold text-emerald-700">
                    ₦{user.balance?.toLocaleString() ?? "0"}
                  </span>
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    Dashboard
                  </Button>
                </Link>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(user.name || "").charAt(0)}
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded border border-red-200 text-center">
            {error}
          </div>
        )}
        {/* Empty State */}
        {!loading && !error && giveaways.length === 0 && (
          <div className="mb-8 p-4 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-center">
            No giveaways available at the moment.
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Giveaways
          </h1>
          <p className="md:text-xl text-sm text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of participants in exciting giveaways from creators
            around the world. Complete simple tasks and win real money!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="md:text-3xl text-xl font-bold text-purple-600">
                ₦
                {giveaways
                  .reduce((sum, g) => sum + (g.totalAmount || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="md:text-sm text-xs text-gray-600">
                Total Prize Pool
              </div>
            </div>
            <div className="text-center">
              <div className="md:text-3xl text-xl font-bold text-blue-600">
                {giveaways.length}
              </div>
              <div className="md:text-sm text-xs text-gray-600">
                Active Giveaways
              </div>
            </div>
            <div className="text-center">
              <div className="md:text-3xl text-xl font-bold text-emerald-600">
                {giveaways
                  .reduce((sum, g) => sum + (g.currentParticipants || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="md:text-sm text-xs text-gray-600">
                Total Participants
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search giveaways by title, creator, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="ending-soon">Ending Soon</option>
              <option value="highest-prize">Highest Prize</option>
              <option value="most-participants">Most Participants</option>
            </select>
          </div>
        </div>

        {/* Giveaways Grid */}
        {filteredGiveaways.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Giveaways Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : user
                ? "You've participated in all available giveaways or they're your own campaigns"
                : "Sign in to see available giveaways"}
            </p>
            {!user && (
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Sign In to Participate
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGiveaways.map((giveaway) => {
              const hasParticipated =
                user &&
                ((user as User).participatedCampaigns ?? []).includes(
                  giveaway._id || giveaway.id || ""
                );
              return (
                <Card
                  key={giveaway._id || giveaway.id}
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group ${
                    hasParticipated ? "opacity-80" : ""
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-1 ${
                          hasParticipated
                            ? "bg-gray-200 text-gray-500 border-gray-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {hasParticipated ? "Participated" : giveaway.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ⏰ {giveaway.timeRemaining} left
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {giveaway.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {giveaway.description}
                    </CardDescription>
                    <div className="text-sm text-gray-500 mt-2">
                      Created by{" "}
                      <span className="font-medium text-gray-700">
                        {giveaway.creatorName || giveaway.creator}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Prize Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                        <div className="text-2xl font-bold text-purple-900">
                          ₦{(giveaway.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Total Prize</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-900">
                          ₦{giveaway.amountPerPerson || 0}
                        </div>
                        <div className="text-xs text-gray-600">Per Winner</div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Participants
                        </span>
                        <span className="font-medium text-gray-900">
                          {giveaway.currentParticipants || 0}/
                          {giveaway.maxParticipants || 0}
                        </span>
                      </div>
                      <Progress
                        value={getProgressPercentage(
                          giveaway.currentParticipants || 0,
                          giveaway.maxParticipants || 0
                        )}
                      />
                      <div className="text-xs text-gray-500 text-center">
                        {Math.max(
                          (giveaway.maxParticipants || 0) -
                            (giveaway.currentParticipants || 0),
                          0
                        )}{" "}
                        spots remaining
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Platforms:</span>
                      <div className="flex gap-1">
                        {(giveaway.platforms || []).map((platform) => (
                          <span
                            key={platform}
                            className="text-lg"
                            title={platform}
                          >
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}

                    {hasParticipated ? (
                      <Link href="/" className="block">
                        <Button
                          className={`w-full group-hover:shadow-lg transition-all ${
                            hasParticipated
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 hover:text-gray-500"
                              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          }`}
                          disabled={hasParticipated}
                          tabIndex={hasParticipated ? -1 : 0}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Already Participated
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/campaign/${giveaway._id || giveaway.id}`}
                        className="block"
                      >
                        <Button
                          className={`w-full group-hover:shadow-lg transition-all
                       
                             bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                        `}
                          disabled={hasParticipated}
                          tabIndex={hasParticipated ? -1 : 0}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join Giveaway
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {user && (
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Create Your Own Giveaway?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Launch your own monetized giveaway campaign and grow your social
              media following while rewarding your community.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Gift className="w-5 h-5 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
