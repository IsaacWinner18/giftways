"use client"
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordTokenPage() {
  const { resetPasswordWithToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(""); setErr("");
    setLoading(true);
    const res = await resetPasswordWithToken(token, newPassword);
    setLoading(false);
    if (res.success) {
      setMsg("Password reset! You can now login.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setErr(res.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        {msg && <div className="text-green-600 text-sm">{msg}</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <Input name="newPassword" placeholder="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
        <div className="text-sm text-center mt-2"><a href="/login" className="text-purple-600 underline">Back to Login</a></div>
      </form>
    </div>
  );
} 