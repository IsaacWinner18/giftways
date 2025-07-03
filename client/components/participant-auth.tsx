"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, ArrowLeft, Eye, EyeOff, UserPlus, LogIn, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  facebook?: string
  linkedin?: string
}

interface ParticipantAuthProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ParticipantAuth({ onSuccess, onCancel }: ParticipantAuthProps) {
  const { login, register } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isLoginMode) {
        const success = await login(formData.email, formData.password)
        if (success) {
          onSuccess()
        } else {
          setError("Invalid credentials. Try demo@giftways.com / demo123")
        }
      } else {
        // Sign up validation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters")
          return
        }

        // Move to social links step
        setCurrentStep(2)
      }
    } catch {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLinksSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate at least one social link
      const hasAtLeastOneLink = Object.values(socialLinks).some((link) => link && link.trim())
      if (!hasAtLeastOneLink) {
        setError("Please provide at least one social media link to continue")
        return
      }

      // Validate URL format for provided links
      const urlPattern = /^https?:\/\/.+/
      const invalidLinks = Object.entries(socialLinks)
        .filter(([, url]) => url && url.trim() && !urlPattern.test(url.trim()))
        .map(([platform]) => platform)

      if (invalidLinks.length > 0) {
        setError(`Please provide valid URLs for: ${invalidLinks.join(", ")}`)
        return
      }

      // Filter out undefined values and convert to Record<string, string>
      const filteredSocialLinks: Record<string, string> = Object.fromEntries(
        Object.entries(socialLinks).filter(([, value]) => value && value.trim())
      )
      
      const success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        socialLinks: filteredSocialLinks
      })
      if (success) {
        onSuccess()
      } else {
        setError("Registration failed. Email might already exist.")
      }
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSocialLink = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }))
  }

  const socialPlatforms = [
    {
      key: "instagram" as keyof SocialLinks,
      label: "Instagram",
      placeholder: "https://instagram.com/username",
      icon: "📷",
    },
    {
      key: "twitter" as keyof SocialLinks,
      label: "Twitter/X",
      placeholder: "https://twitter.com/username",
      icon: "🐦",
    },
    { key: "tiktok" as keyof SocialLinks, label: "TikTok", placeholder: "https://tiktok.com/@username", icon: "🎵" },
    { key: "youtube" as keyof SocialLinks, label: "YouTube", placeholder: "https://youtube.com/@username", icon: "📺" },
    {
      key: "facebook" as keyof SocialLinks,
      label: "Facebook",
      placeholder: "https://facebook.com/username",
      icon: "📘",
    },
    {
      key: "linkedin" as keyof SocialLinks,
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
      icon: "💼",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Giftways
            </span>
          </div>
          <p className="text-gray-300">Join the giveaway community</p>
        </div>

        <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              {isLoginMode ? (
                <>
                  <LogIn className="w-6 h-6" />
                  Welcome Back
                </>
              ) : currentStep === 1 ? (
                <>
                  <UserPlus className="w-6 h-6" />
                  Create Account
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6" />
                  Social Media Links
                </>
              )}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLoginMode
                ? "Sign in to participate in giveaways"
                : currentStep === 1
                  ? "Join thousands of giveaway participants"
                  : "Add your social media profiles (at least one is required)"}
            </CardDescription>
            {!isLoginMode && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? "bg-purple-500" : "bg-gray-600"}`} />
                <div className={`w-8 h-0.5 ${currentStep >= 2 ? "bg-purple-500" : "bg-gray-600"}`} />
                <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? "bg-purple-500" : "bg-gray-600"}`} />
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoginMode || currentStep === 1 ? (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required={!isLoginMode}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-200">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required={!isLoginMode}
                    />
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isLoginMode ? "Signing in..." : "Next Step..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">{isLoginMode ? "Sign In" : "Continue"}</div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSocialLinksSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-300 text-sm">
                    Add your social media profiles. These will be used to verify your participation in giveaways.
                  </p>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.key} className="space-y-2">
                      <Label className="text-gray-200 flex items-center gap-2">
                        <span className="text-lg">{platform.icon}</span>
                        {platform.label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={platform.placeholder}
                          value={socialLinks[platform.key] || ""}
                          onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                        {socialLinks[platform.key] && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(socialLinks[platform.key], "_blank")}
                            className="text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Account...
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode)
                  setCurrentStep(1)
                  setError("")
                  setFormData({ email: "", password: "", name: "", confirmPassword: "" })
                  setSocialLinks({})
                }}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaign
              </Button>
            </div>

            {isLoginMode && (
              <div className="text-center text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
                <strong>Demo Login:</strong>
                <br />
                Email: demo@giftways.com | Password: demo123
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
