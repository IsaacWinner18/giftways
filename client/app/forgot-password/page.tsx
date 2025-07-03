"use client"
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(""); setErr(""); setToken("");
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) {
      setMsg("Check your email for a reset link (token shown below for testing)");
      setToken(res.resetToken || "");
    } else {
      setErr(res.error || "Request failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
        {msg && <div className="text-green-600 text-sm">{msg}</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <Input name="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
        {token && <div className="text-xs mt-2">Reset Token: <span className="font-mono break-all">{token}</span></div>}
        <div className="text-sm text-center mt-2"><a href="/login" className="text-purple-600 underline">Back to Login</a></div>
      </form>
    </div>
  );
} 