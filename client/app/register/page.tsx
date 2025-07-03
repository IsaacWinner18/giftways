"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.success) {
      setSuccess("Registration successful! Please login.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-purple-100">
        <h2 className="text-3xl font-extrabold mb-2 text-purple-700 text-center">Create Account</h2>
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">{success}</div>}
        <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="focus:ring-2 focus:ring-purple-400" />
        <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="focus:ring-2 focus:ring-purple-400" />
        <Input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required className="focus:ring-2 focus:ring-purple-400" />
        <Input name="bankName" placeholder="Bank Name (optional)" value={form.bankName} onChange={handleChange} />
        <Input name="accountNumber" placeholder="Account Number (optional)" value={form.accountNumber} onChange={handleChange} />
        <Input name="accountName" placeholder="Account Name (optional)" value={form.accountName} onChange={handleChange} />
        <Input name="phoneNumber" placeholder="Phone Number (optional)" value={form.phoneNumber} onChange={handleChange} />
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
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
        <div className="text-sm text-center mt-2">Already have an account? <a href="/login" className="text-purple-600 underline">Login</a></div>
      </form>
    </div>
  );
} 