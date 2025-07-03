"use client"
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const { user, updateProfile, changePassword, logout, loading } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || "",
    bankName: user?.bankName || "",
    accountNumber: user?.accountNumber || "",
    accountName: user?.accountName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [pwForm, setPwForm] = useState<PasswordForm>({ oldPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Not logged in.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setMsg(""); setErr("");
    const res = await updateProfile(form);
    setProfileLoading(false);
    if (res.success) {
      setMsg("Profile updated!");
      setEdit(false);
    } else {
      setErr(res.error || "Update failed");
    }
  };

  const handlePwSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLoading(true);
    setMsg(""); setErr("");
    const res = await changePassword(pwForm.oldPassword, pwForm.newPassword);
    setPwLoading(false);
    if (res.success) {
      setMsg("Password changed!");
      setPwForm({ oldPassword: "", newPassword: "" });
    } else {
      setErr(res.error || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-2">My Profile</h2>
        {msg && <div className="text-green-600 text-sm">{msg}</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}
        {!edit ? (
          <div className="space-y-2">
            <div><b>Name:</b> {user.name}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Bank Name:</b> {user.bankName || "-"}</div>
            <div><b>Account Number:</b> {user.accountNumber || "-"}</div>
            <div><b>Account Name:</b> {user.accountName || "-"}</div>
            <div><b>Phone:</b> {user.phoneNumber || "-"}</div>
            <Button onClick={() => setEdit(true)} className="mt-2 w-full">Edit Profile</Button>
            <Button onClick={logout} variant="outline" className="mt-2 w-full">Logout</Button>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-2">
            <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <Input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} />
            <Input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} />
            <Input name="accountName" placeholder="Account Name" value={form.accountName} onChange={handleChange} />
            <Input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} />
            <Button type="submit" className="w-full" disabled={profileLoading}>{profileLoading ? "Saving..." : "Save"}</Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setEdit(false)}>Cancel</Button>
          </form>
        )}
        <form onSubmit={handlePwSubmit} className="space-y-2 border-t pt-4 mt-4">
          <h3 className="font-semibold">Change Password</h3>
          <Input name="oldPassword" placeholder="Old Password" type="password" value={pwForm.oldPassword} onChange={handlePwChange} required />
          <Input name="newPassword" placeholder="New Password" type="password" value={pwForm.newPassword} onChange={handlePwChange} required />
          <Button type="submit" className="w-full" disabled={pwLoading}>{pwLoading ? "Changing..." : "Change Password"}</Button>
        </form>
      </div>
    </div>
  );
} 