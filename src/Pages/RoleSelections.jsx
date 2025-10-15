import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Building2, Users } from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [phone, setPhone] = React.useState("");
  const [vehiclePlate, setVehiclePlate] = React.useState("");
  const [vehicleModel, setVehicleModel] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  // 🧠 Mock user object (instead of Supabase)
  const mockUser = {
    id: 1,
    name: "John Doe",
    email: "johndoe@email.com",
    user_type: null,
  };

  // 🧭 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API delay
    setTimeout(() => {
      console.log("User data saved (mock):", {
        id: mockUser.id,
        name: mockUser.name,
        selectedRole,
        phone,
        vehiclePlate,
        vehicleModel,
        businessName,
      });

      // Navigate to appropriate dashboard
      if (selectedRole === "driver" || selectedRole === "both") {
        navigate("/dashboard/driver");
      } else {
        navigate("/dashboard/operator");
      }

      setSaving(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome to SmartParking!
          </h1>
          <p className="text-gray-600">Let's set up your account</p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-emerald-400"
              onClick={() => setSelectedRole("driver")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle>I'm a Driver</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>Find and book parking spaces across Lagos</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-yellow-400"
              onClick={() => setSelectedRole("operator")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle>I'm an Operator</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>List and manage parking spaces</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-purple-400"
              onClick={() => setSelectedRole("both")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>I'm Both</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>Driver and operator features</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // 🧾 Profile Completion Form
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+234 801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {(selectedRole === "driver" || selectedRole === "both") && (
                  <>
                    <div>
                      <Label htmlFor="plate">Vehicle Plate Number *</Label>
                      <Input
                        id="plate"
                        placeholder="e.g., LAG 123 AB"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Vehicle Model *</Label>
                      <Input
                        id="model"
                        placeholder="e.g., Toyota Camry 2020"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {(selectedRole === "operator" || selectedRole === "both") && (
                  <div>
                    <Label htmlFor="business">Business Name *</Label>
                    <Input
                      id="business"
                      placeholder="e.g., City Mall Parking"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedRole(null)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600"
                  >
                    {saving ? "Saving..." : "Continue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
