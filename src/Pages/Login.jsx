import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { ParkingCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/driver"); // ✅ Redirect after successful login
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Logo Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-white rounded-xl flex items-center justify-center">
              <ParkingCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-xl">SmartPark</h1>
              <p className="text-sm text-gray-500"> Park Smart</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-600">Welcome back! Let’s get you parked faster.</p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Google Sign-in 
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            variant="outline"
            className="flex items-center justify-center gap-3 border-gray-300 w-full py-6"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
*/}
          {/* Manual Sign-in */}
          <form onSubmit={handleLogin} className="space-y-6 w-full">
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

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full py-6"
              />

              {/* ✅ Forgot Password Link */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-emerald-600 font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Redirect link */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
