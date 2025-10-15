import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ParkingCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("driver");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    vehicle_plate: "",
    vehicle_model: "",
    business_name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Example signup logic (replace with your API/Supabase)
    try {
      console.log("Registering user:", { ...formData, userType });
      alert("Signup successful!");
      navigate("/sign-in");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Please try again.");
    }
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
              <p className="text-sm text-gray-500"> Park Smartly</p>
            </div>
          </div>
        </div>

        <Card className="shadow-none">
          <CardContent>
            {/* User Type Selector */}
            <div className="flex justify-center gap-3 mb-6 pt-2">
              {["driver", "operator", "both"].map((type) => (
                <Button
                  key={type}
                  variant={userType === type ? "default" : "outline"}
                  className={`capitalize ${
                    userType === type
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : ""
                  }`}
                  onClick={() => setUserType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Always visible fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Conditional Fields */}
              {(userType === "driver" || userType === "both") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Plate Number
                    </label>
                    <Input
                      name="vehicle_plate"
                      value={formData.vehicle_plate}
                      onChange={handleChange}
                      required={userType !== "operator"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Model
                    </label>
                    <Input
                      name="vehicle_model"
                      value={formData.vehicle_model}
                      onChange={handleChange}
                      required={userType !== "operator"}
                    />
                  </div>
                </>
              )}

              {(userType === "operator" || userType === "both") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name / Parking Lot Name
                  </label>
                  <Input
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required={userType !== "driver"}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-white py-6 text-lg"
              >
                Sign Up
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/sign-in")}
                className="text-emerald-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
