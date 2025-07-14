"use client";

import type React from "react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Clock,
  Hash,
  Sparkles,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";
import { CampaignSuccessPage } from "@/components/campaign-success-page";
import { useAuth } from "@/lib/auth-context";

interface SocialRequirement {
  id: string;
  platform: string;
  profileUrl: string;
  action: string;
  displayName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function CreateCampaignContent() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalAmount: "",
    maxParticipants: "",
    distributionRule: "equal",
    beneficiaries: "",
    timeLimit: "",
  });

  const [socialRequirements, setSocialRequirements] = useState<
    SocialRequirement[]
  >([
    {
      id: "1",
      platform: "",
      profileUrl: "",
      action: "follow",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [campaignUrl, setCampaignUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [beneficiariesError, setBeneficiariesError] = useState("");
  const [maxParticipantsError, setMaxParticipantsError] = useState("");

  // Derived values
  const amount = Number(formData.totalAmount);
  const minAmount = 2000;
  const minPerPerson = 500;
  const beneficiaries = Number(formData.beneficiaries);
  const maxBeneficiaries = amount ? Math.floor(amount / minPerPerson) : 0;
  const maxParticipants = maxBeneficiaries * 100;
  // New: beneficiaries cannot be more than maxParticipants
  const beneficiariesMaxLimit = Math.min(
    maxBeneficiaries,
    Number(formData.maxParticipants) || maxBeneficiaries
  );

  // Dynamic logic for beneficiaries and maxParticipants
  useEffect(() => {
    // beneficiaries: min 2, max = maxBeneficiaries
    let newBeneficiaries = beneficiaries;
    if (!beneficiaries || beneficiaries < 2) newBeneficiaries = 2;
    if (newBeneficiaries > maxBeneficiaries)
      newBeneficiaries = maxBeneficiaries;

    // maxParticipants: min = beneficiaries, max = maxBeneficiaries * 100
    let newMaxParticipants = Number(formData.maxParticipants);
    if (!newMaxParticipants || newMaxParticipants < newBeneficiaries)
      newMaxParticipants = newBeneficiaries;
    if (newMaxParticipants > maxParticipants)
      newMaxParticipants = maxParticipants;

    setFormData((prev) => ({
      ...prev,
      beneficiaries: amount >= minAmount ? String(newBeneficiaries) : "",
      maxParticipants: amount >= minAmount ? String(newMaxParticipants) : "",
    }));
  }, [
    formData.totalAmount,
    amount,
    beneficiaries,
    formData.maxParticipants,
    maxBeneficiaries,
    maxParticipants,
    minAmount,
  ]);

  // Handler for beneficiaries change
  const handleBeneficiariesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const numValue = Number(value);
    let newMaxParticipants = Number(formData.maxParticipants);
    if (numValue > newMaxParticipants) {
      newMaxParticipants = numValue;
    }
    setFormData({
      ...formData,
      beneficiaries: value,
      maxParticipants: String(newMaxParticipants),
    });
  };

  // Handler for maxParticipants change
  const handleMaxParticipantsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const numValue = Number(value);
    const numBeneficiaries = Number(formData.beneficiaries);
    if (numValue < numBeneficiaries) {
      setFormData({
        ...formData,
        maxParticipants: String(numBeneficiaries),
      });
    } else {
      setFormData({
        ...formData,
        maxParticipants: value,
      });
    }
  };

  const addSocialRequirement = () => {
    const newRequirement: SocialRequirement = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      platform: "",
      profileUrl: "",
      action: "follow",
    };
    setSocialRequirements([...socialRequirements, newRequirement]);
  };

  const removeSocialRequirement = (id: string) => {
    if (socialRequirements.length > 1) {
      setSocialRequirements(socialRequirements.filter((req) => req.id !== id));
    }
  };

  const updateSocialRequirement = (
    id: string,
    field: keyof SocialRequirement,
    value: string
  ) => {
    setSocialRequirements(
      socialRequirements.map((req) =>
        req.id === id ? { ...req, [field]: value } : req
      )
    );
  };

  const validateFields = () => {
    let valid = true;
    setBeneficiariesError("");
    setMaxParticipantsError("");
    setFormError("");

    if (!formData.beneficiaries || isNaN(Number(formData.beneficiaries))) {
      setBeneficiariesError("Number of beneficiaries is required");
      valid = false;
    } else if (
      Number(formData.beneficiaries) < 2 ||
      Number(formData.beneficiaries) > maxBeneficiaries
    ) {
      setBeneficiariesError(
        `Beneficiaries must be between 2 and ${maxBeneficiaries}`
      );
      valid = false;
    }

    if (!formData.maxParticipants || isNaN(Number(formData.maxParticipants))) {
      setMaxParticipantsError("Max participants is required");
      valid = false;
    } else if (
      Number(formData.maxParticipants) < Number(formData.beneficiaries) ||
      Number(formData.maxParticipants) > maxParticipants
    ) {
      setMaxParticipantsError(
        `Max participants must be between ${formData.beneficiaries} and ${maxParticipants}`
      );
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    if (!validateFields()) {
      setIsSubmitting(false);
      return;
    }

    // Calculate total to pay (amount + 2.5% fee)
    const totalToPay = formData.totalAmount
      ? Math.floor(
          Number(formData.totalAmount) + Number(formData.totalAmount) * 0.025
        )
      : 0;
    const userEmail = user?.email;
    if (!userEmail) {
      setFormError("User email not found. Please update your profile.");
      setIsSubmitting(false);
      return;
    }
    // Generate unique reference: creator name (no spaces, lowercase) + timestamp
    const creatorName = (user?.name || 'user').replace(/\s+/g, '').toLowerCase();
    const reference = `${creatorName}_${Date.now()}`;

    try {
      // Dynamically import PaystackPop
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: userEmail,
        amount: totalToPay * 100, // Paystack expects kobo
        reference,
        metadata: {
          campaignTitle: formData.title,
        },
        onSuccess: async (transaction: any) => {
          // Proceed to create campaign after successful payment
          try {
            // Validate social requirements
            const validSocialRequirements = socialRequirements
              .filter((req) => req.platform && req.profileUrl)
              .map((req) => ({
                ...req,
                displayName:
                  req.displayName ||
                  (req.profileUrl
                    ? req.profileUrl
                        .replace(/https?:\/\/(www\.)?/, "")
                        .split(/[/?#]/)[0]
                    : req.platform),
              }));

            if (validSocialRequirements.length === 0) {
              throw new Error(
                "Please add at least one social media requirement"
              );
            }

            const response = await fetch(`${API_URL}/campaigns`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...formData,
                socialRequirements: validSocialRequirements,
                creatorId:
                  (user as { _id?: string; id?: string })?._id || user?.id,
                creatorName: user?.name,
                paystackReference: transaction.reference,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              setFormError(errorData.error || "Failed to create campaign");
              setIsSubmitting(false);
              return;
            }

            const data = await response.json();
            setCampaignUrl(
              `${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                data.campaign.campaignUrl
              }` || `https://giftways.com/campaign/${data.campaign.id}`
            );
            setIsSuccess(true);
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to create campaign";
            setFormError(
              `Failed to create campaign: ${errorMessage}. Please try again.`
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        onCancel: () => {
          setIsSubmitting(false);
          alert("Transaction cancelled");
        },
      });
    } catch (error) {
      setFormError("Failed to initialize payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <CampaignSuccessPage campaignUrl={campaignUrl} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700">
          <Sparkles className="w-4 h-4" />
          Create New Campaign
        </div>
        <h1 className=" text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Launch Your Giveaway
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto text-center">
          Set up your monetized giveaway campaign in minutes. Define your rules,
          set your budget, and watch the magic happen.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Gift className="w-6 h-6 text-purple-600" />
                Campaign Details
              </CardTitle>
              <CardDescription className="text-base">
                Configure your giveaway campaign settings and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center font-medium">
                    {formError}
                  </div>
                )}
                {/* Campaign Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Campaign Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Christmas Giveaway 2024"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-medium"
                  >
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell participants about your giveaway..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-[100px] text-base"
                  />
                </div>

                {/* Social Media Requirements */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Social Media Requirements
                    </Label>
                    <Button
                      type="button"
                      onClick={addSocialRequirement}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Platform
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {socialRequirements.map((requirement) => (
                      <Card
                        key={requirement.id}
                        className="p-4 bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Platform
                              </Label>
                              <Select
                                value={requirement.platform}
                                onValueChange={(value) =>
                                  updateSocialRequirement(
                                    requirement.id,
                                    "platform",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="instagram">
                                    Instagram
                                  </SelectItem>
                                  <SelectItem value="twitter">
                                    Twitter/X
                                  </SelectItem>
                                  <SelectItem value="tiktok">TikTok</SelectItem>
                                  <SelectItem value="youtube">
                                    YouTube
                                  </SelectItem>
                                  <SelectItem value="facebook">
                                    Facebook
                                  </SelectItem>
                                  <SelectItem value="linkedin">
                                    LinkedIn
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Action
                              </Label>
                              <Select
                                value={requirement.action}
                                onValueChange={(value) =>
                                  updateSocialRequirement(
                                    requirement.id,
                                    "action",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="follow">Follow</SelectItem>
                                  <SelectItem value="like">
                                    Like Post
                                  </SelectItem>
                                  <SelectItem value="subscribe">
                                    Subscribe
                                  </SelectItem>
                                  <SelectItem value="join">
                                    Join Group
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Profile URL
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="https://instagram.com/username"
                                  value={requirement.profileUrl}
                                  onChange={(e) =>
                                    updateSocialRequirement(
                                      requirement.id,
                                      "profileUrl",
                                      e.target.value
                                    )
                                  }
                                  className="h-10 text-sm"
                                  required
                                />
                                {requirement.profileUrl && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      window.open(
                                        requirement.profileUrl,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {socialRequirements.length > 1 && (
                            <Button
                              type="button"
                              onClick={() =>
                                removeSocialRequirement(requirement.id)
                              }
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Amount and Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="totalAmount"
                      className="text-base font-medium"
                    >
                      Total Amount (NGN)
                    </Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      placeholder="2000"
                      value={formData.totalAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalAmount: e.target.value,
                        })
                      }
                      className="h-12 text-base"
                      min={minAmount}
                      required
                    />
                    <p className="text-xs text-gray-500">Minimum: ₦2,000</p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="beneficiaries"
                      className="text-base font-medium"
                    >
                      Number of Beneficiaries
                    </Label>
                    <Input
                      id="beneficiaries"
                      type="number"
                      placeholder="2"
                      value={formData.beneficiaries}
                      onChange={handleBeneficiariesChange}
                      className="h-12 text-base"
                      min={2}
                      max={maxBeneficiaries}
                      disabled={!amount || amount < minAmount}
                      required
                    />
                    {beneficiariesError && (
                      <div className="text-xs text-red-600 mt-1">
                        {beneficiariesError}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Min: 2, Max: {maxBeneficiaries} (₦500 per person minimum)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="maxParticipants"
                      className="text-base font-medium"
                    >
                      Max Participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder={String(maxParticipants || 2)}
                      value={formData.maxParticipants}
                      onChange={handleMaxParticipantsChange}
                      className="h-12 text-base"
                      min={Number(formData.beneficiaries) || 2}
                      max={maxParticipants}
                      disabled={!amount || amount < minAmount || !beneficiaries}
                      required
                    />
                    {maxParticipantsError && (
                      <div className="text-xs text-red-600 mt-1">
                        {maxParticipantsError}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Min: {Number(formData.beneficiaries) || 2}, Max:{" "}
                      {maxParticipants} (100× max beneficiaries)
                    </p>
                  </div>
                </div>

                {/* Distribution Rules */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Distribution Rule
                  </Label>
                  <RadioGroup
                    value={formData.distributionRule}
                    onValueChange={(value) =>
                      setFormData({ ...formData, distributionRule: value })
                    }
                  >
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-purple-50 transition-colors">
                      <RadioGroupItem value="order" id="order" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Label
                            htmlFor="order"
                            className="cursor-pointer font-medium text-base"
                          >
                            By Order
                          </Label>
                          <p className="text-sm text-gray-600">
                            First to submit = first to receive.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-purple-50 transition-colors">
                      <RadioGroupItem value="random" id="random" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Label
                            htmlFor="random"
                            className="cursor-pointer font-medium text-base"
                          >
                            Random
                          </Label>
                          <p className="text-sm text-gray-600">
                            Winners are selected randomly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Time Limit (if time-based) */}
                {formData.distributionRule === "time" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="timeLimit"
                      className="text-base font-medium"
                    >
                      Time Limit (Hours)
                    </Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      placeholder="24"
                      value={formData.timeLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, timeLimit: e.target.value })
                      }
                      className="h-12 text-base"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 text-base font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    "Create Campaign & Pay"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-xl text-purple-900">
                Campaign Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 font-semibold"
                  >
                    ₦
                    {formData.totalAmount
                      ? Number(formData.totalAmount).toLocaleString()
                      : "0"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Beneficiaries:</span>
                  <Badge
                    variant="secondary"
                    className="bg-pink-100 text-pink-800 font-semibold"
                  >
                    {formData.beneficiaries}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Max Participants:</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 font-semibold"
                  >
                    {formData.maxParticipants ||
                      (formData.distributionRule === "order" ? "-" : "0")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount per Person:</span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 font-semibold"
                  >
                    ₦
                    {formData.totalAmount && formData.beneficiaries
                      ? Math.floor(
                          Number(formData.totalAmount) /
                            Number(formData.beneficiaries)
                        ).toLocaleString()
                      : "0"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social Requirements:</span>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 font-semibold"
                  >
                    {
                      socialRequirements.filter(
                        (req) => req.platform && req.profileUrl
                      ).length
                    }
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900">Platform Fee (2.5%):</span>
                  <span className="text-purple-600">
                    ₦
                    {formData.totalAmount
                      ? Math.floor(
                          Number(formData.totalAmount) * 0.025
                        ).toLocaleString()
                      : "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-2">
                  <span className="text-gray-900">Total to Pay:</span>
                  <span className="text-purple-600">
                    ₦
                    {formData.totalAmount
                      ? (
                          Number(formData.totalAmount) +
                          Math.floor(Number(formData.totalAmount) * 0.025)
                        ).toLocaleString()
                      : "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use engaging titles to attract more participants</li>
                <li>• Add multiple social platforms for better reach</li>
                <li>
                  • Set realistic participant limits for better engagement
                </li>
                <li>• Time-based campaigns create urgency</li>
                <li>• Verify your social URLs before publishing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
