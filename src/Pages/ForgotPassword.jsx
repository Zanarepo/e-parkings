import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParkingCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending reset email
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Logo Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 rounded-xl flex items-center justify-center">
              <ParkingCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-xl">E-Parking</h1>
              <p className="text-sm text-gray-500">Lagos Smart Parking</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-gray-600">
            Enter your email, and we’ll send you a link to reset your password.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleForgotPassword} className="space-y-6 w-full">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full py-6"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/sign-in")}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </p>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-emerald-600 font-medium mb-6">
              ✅ A password reset link has been sent to <strong>{email}</strong>.
            </p>
            <Button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-6 rounded-xl font-semibold"
            >
              Return to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
