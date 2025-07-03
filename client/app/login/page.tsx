"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      router.push("/profile");
    } else {
      setError(res.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-purple-100">
        <h2 className="text-3xl font-extrabold mb-2 text-purple-700 text-center">Sign In</h2>
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
        <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="focus:ring-2 focus:ring-purple-400" />
        <Input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required className="focus:ring-2 focus:ring-purple-400" />
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg shadow transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
        <div className="text-sm text-center mt-2">
          <a href="/forgot-password" className="text-purple-600 underline">Forgot password?</a>
        </div>
        <div className="text-sm text-center mt-2">Don&apos;t have an account? <a href="/register" className="text-purple-600 underline">Register</a></div>
      </form>
    </div>
  );
} 