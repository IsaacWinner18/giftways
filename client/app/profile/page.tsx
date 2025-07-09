"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface ProfileForm {
  name: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
}

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || "",
    bankName: user?.bankName || "",
    accountNumber: user?.accountNumber || "",
    accountName: user?.accountName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 text-white px-6 py-4 rounded-xl shadow-lg text-lg">
          Not logged in.
        </div>
      </div>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setMsg("");
    setErr("");
    // JS validation for all fields
    if (
      !form.name ||
      !form.bankName ||
      !form.accountNumber ||
      !form.accountName ||
      !form.phoneNumber
    ) {
      setProfileLoading(false);
      setErr("All fields are required.");
      return;
    }
    const res = await updateProfile(form);
    setProfileLoading(false);
    if (res.success) {
      setMsg("Profile updated!");
      setTimeout(() => router.push("/giveaways"), 1000);
    } else {
      setErr(res.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-black/40 border-white/20 backdrop-blur-xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-white">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {msg && (
            <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">
              {msg}
            </div>
          )}
          {err && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
              {err}
            </div>
          )}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Full Name
              </Label>
              <Input
                name="name"
                id="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-gray-200">
                Bank Name
              </Label>
              <Input
                name="bankName"
                id="bankName"
                placeholder="Bank Name"
                value={form.bankName}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-gray-200">
                Account Number
              </Label>
              <Input
                name="accountNumber"
                id="accountNumber"
                placeholder="Account Number"
                value={form.accountNumber}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-gray-200">
                Account Name
              </Label>
              <Input
                name="accountName"
                id="accountName"
                placeholder="Account Name"
                value={form.accountName}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-200">
                Phone Number
              </Label>
              <Input
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
              disabled={profileLoading}
            >
              {profileLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">Save</div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
