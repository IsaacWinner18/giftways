"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step1Form {
  name: string;
  email: string;
  password: string;
}

interface Step2Form {
  bankName: string;
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  const { register, login, updateProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1Form>({
    name: "",
    email: "",
    password: "",
  });
  const [step2, setStep2] = useState<Step2Form>({
    bankName: "",
    accountNumber: "",
    accountName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep1({ ...step1, [e.target.name]: e.target.value });
  };
  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2({ ...step2, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await register(step1);
    setLoading(false);
    if (res.success) {
      // Optionally auto-login user after registration
      setSuccess(
        "Step 1 complete! Please provide your bank and phone details."
      );
      setStep(2);
      // Optionally, you could auto-login here:
      // await login(step1.email, step1.password);
    } else {
      setError(res.error || "Registration failed");
    }
  };

  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await updateProfile(step2);
    setLoading(false);
    if (res.success) {
      setSuccess("Registration complete! Please login.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setError(res.error || "Failed to save details");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <form
        onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-purple-100"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-purple-700 text-center">
          {step === 1 ? "Create Account" : "Complete Your Details"}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">
            {success}
          </div>
        )}
        {step === 1 ? (
          <>
            <Input
              name="name"
              placeholder="Full Name"
              value={step1.name}
              onChange={handleStep1Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={step1.email}
              onChange={handleStep1Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              value={step1.password}
              onChange={handleStep1Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Registering..." : "Next"}
            </Button>
          </>
        ) : (
          <>
            <Input
              name="bankName"
              placeholder="Bank Name"
              value={step2.bankName}
              onChange={handleStep2Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Input
              name="accountNumber"
              placeholder="Account Number"
              value={step2.accountNumber}
              onChange={handleStep2Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Input
              name="accountName"
              placeholder="Account Name"
              value={step2.accountName}
              onChange={handleStep2Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={step2.phoneNumber}
              onChange={handleStep2Change}
              required
              className="focus:ring-2 focus:ring-purple-400"
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Finish Registration"}
            </Button>
          </>
        )}
        {step === 1 && (
          <>
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
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 underline">
                Login
              </a>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
