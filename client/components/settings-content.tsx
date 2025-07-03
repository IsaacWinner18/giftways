"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Crown, Bell, Shield, CreditCard, LogOut, Camera, Eye, EyeOff } from "lucide-react"

export function SettingsContent() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showSessionsDialog, setShowSessionsDialog] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    socialLinks: user?.socialLinks || {},
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    campaignUpdates: true,
    newParticipants: true,
    payoutNotifications: true,
    marketingUpdates: false,
  })

  // Mock active sessions
  const activeSessions = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "Lagos, Nigeria",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Abuja, Nigeria",
      lastActive: "1 hour ago",
      current: false,
    },
    {
      id: "3",
      device: "Chrome on Android",
      location: "Port Harcourt, Nigeria",
      lastActive: "2 days ago",
      current: false,
    },
  ]

  const handleSave = () => {
    // In real app, this would update the user profile
    setIsEditing(false)
    // Show success message
    alert("Profile updated successfully!")
  }

  const handleAvatarChange = () => {
    // In real app, this would upload the image
    setShowAvatarDialog(false)
    alert("Avatar updated successfully!")
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }
    // In real app, this would update the password
    setShowPasswordDialog(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    alert("Password updated successfully!")
  }

  const handleSessionRevoke = (sessionId: string) => {
    // In real app, this would revoke the session
    alert(`Session ${sessionId} revoked successfully!`)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    // In real app, this would save to backend
    alert(`${key} notifications ${value ? "enabled" : "disabled"}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and security settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl || user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                        <DialogDescription>Upload a new profile picture or enter an image URL</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="avatarUrl">Image URL</Label>
                          <Input
                            id="avatarUrl"
                            placeholder="https://example.com/avatar.jpg"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                          />
                        </div>
                        <div className="text-center">
                          <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Preview" />
                            <AvatarFallback>Preview</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAvatarChange} className="flex-1">
                            Update Avatar
                          </Button>
                          <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    {user?.isVerified && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries({
                    instagram: "Instagram",
                    twitter: "Twitter",
                    youtube: "YouTube",
                    tiktok: "TikTok",
                    facebook: "Facebook",
                    linkedin: "LinkedIn",
                  }).map(([platform, label]) => (
                    <div key={platform} className="space-y-2">
                      <Label htmlFor={platform}>{label}</Label>
                      <Input
                        id={platform}
                        placeholder={`https://${platform}.com/username`}
                        value={formData.socialLinks[platform] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, [platform]: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Campaign Updates</Label>
                  <p className="text-sm text-gray-600">Get notified about campaign status changes</p>
                </div>
                <Switch
                  checked={notifications.campaignUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("campaignUpdates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">New Participants</Label>
                  <p className="text-sm text-gray-600">Receive alerts when someone joins your campaign</p>
                </div>
                <Switch
                  checked={notifications.newParticipants}
                  onCheckedChange={(checked) => handleNotificationChange("newParticipants", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Payout Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified when payouts are processed</p>
                </div>
                <Switch
                  checked={notifications.payoutNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("payoutNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Marketing Updates</Label>
                  <p className="text-sm text-gray-600">Receive tips and platform updates</p>
                </div>
                <Switch
                  checked={notifications.marketingUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("marketingUpdates", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Change Password</Label>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password and choose a new one</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePasswordChange} className="flex-1">
                          Update Password
                        </Button>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Login Sessions</Label>
                  <p className="text-sm text-gray-600">Manage your active login sessions</p>
                </div>
                <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Active Login Sessions</DialogTitle>
                      <DialogDescription>Manage devices that are currently signed in to your account</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{session.device}</p>
                              {session.current && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{session.location}</p>
                            <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                          </div>
                          {!session.current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSessionRevoke(session.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{user?.totalCampaigns}</div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">₦{user?.totalDistributed?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Distributed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{user?.totalParticipants?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">•••• 4242</div>
                    <div className="text-xs text-gray-600">Expires 12/25</div>
                  </div>
                </div>
                <Badge variant="secondary">Primary</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                Deactivate Account
              </Button>
              <Button onClick={logout} variant="outline" className="w-full flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
