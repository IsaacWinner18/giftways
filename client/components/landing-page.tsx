"use client";

import type React from "react";

import { useState } from "react";
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
  Gift,
  ArrowRight,
  Users,
  Shield,
  Star,
  Eye,
  EyeOff,
  Plus,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export function LandingPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLoginMode) {
        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setError(res.error || "Invalid credentials");
        }
      } else {
        // Registration mode
        const res = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if (res.success) {
          setSuccess("Registration successful! Please log in.");
          setIsLoginMode(true);
        } else {
          setError(res.error || "Registration failed");
        }
      }
    } catch {
      setError(
        isLoginMode
          ? "Login failed. Please try again."
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className=" text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Giftways
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="text-purple-300 hover:text-white bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={() => {
                setIsLoginMode(false);
                document
                  .getElementById("auth-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Register
            </Button>
            {/* <div className="text-sm text-purple-300">Demo: demo@giftways.com / demo123</div> */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium text-purple-300 border border-purple-500/30">
              <Star className="w-4 h-4" />
              Trusted by 10,000+ creators worldwide
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Giveaways
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
              Create monetized giveaway campaigns or participate in exciting
              giveaways. Win real money prizes by completing simple social media
              tasks.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Create</div>
                  <div className="text-sm text-gray-400">Campaigns</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Participate</div>
                  <div className="text-sm text-gray-400">& Win</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Secure</div>
                  <div className="text-sm text-gray-400">Payments</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/giveaways">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Discover Giveaways
                </Button>
              </Link>
              <Button
                size="lg"
                className="border-white/20 text-white hover:from-purple-700 hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={() =>
                  document
                    .getElementById("auth-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Campaign
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">₦2.5M+</div>
                <div className="text-sm text-gray-400">Distributed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center" id="auth-form">
            <Card className="w-full max-w-md bg-black/40 border-white/20 backdrop-blur-xl">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold text-white">
                  {isLoginMode ? "Welcome Back" : "Get Started"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isLoginMode
                    ? "Sign in to your Giftways account"
                    : "Create your Giftways account"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {success && (
                  <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">
                    {success}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLoginMode && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-200">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required={!isLoginMode}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

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
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isLoginMode ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    {isLoginMode
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                {/* <div className="text-center text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: demo@giftways.com
                  <br />
                  Password: demo123
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
