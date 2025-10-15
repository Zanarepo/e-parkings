import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState("/default-avatar.png");
  const navigate = useNavigate();

  const user = {
    role: "both",
    fullName: "John Doe",
    email: "john@example.com",
    businessName: "Downtown Parking Hub",
    phone: "+234 812 345 6789",
    plateNumber: "ABC-123-LG",
    vehicleBrand: "Toyota Corolla",
    nin: "22345678909",
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 to-yellow-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-white border-b border-emerald-100 px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-10 w-full">
        <div className="flex items-center gap-3">
          
          {/* Back Button 
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>*/}
          <h1 className="text-2xl font-bold text-emerald-800">Profile</h1>
        </div>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className="text-emerald-700 border-emerald-400 hover:bg-emerald-50"
        >
          <Pencil className="w-4 h-4 mr-2" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </header>

      {/* Main Content (Full Width) */}
      <main className="flex-1 w-full">
        <div className="w-full bg-white shadow-md border-t border-emerald-100 rounded-none p-6 sm:p-10">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32">
              <img
                src={profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-emerald-500 object-cover"
              />
              <label
                htmlFor="upload"
                className="absolute bottom-2 right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer transition-transform hover:scale-110"
              >
                <Upload className="w-4 h-4" />
              </label>
              <input
                id="upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <InputField label="Full Name" value={user.fullName} editable={isEditing} />
            <InputField label="Email" value={user.email} editable={isEditing} />
            <InputField label="Phone Number" value={user.phone} editable={isEditing} />

            {user.role !== "driver" && (
              <>
                <InputField label="Business Name" value={user.businessName} editable={isEditing} />
                <InputField label="NIN ID" value={user.nin} editable={isEditing} />
              </>
            )}

            {user.role !== "operator" && (
              <>
                <InputField label="Vehicle Plate Number" value={user.plateNumber} editable={isEditing} />
                <InputField label="Vehicle Brand" value={user.vehicleBrand} editable={isEditing} />
              </>
            )}
          </div>

          {/* Password Update */}
          <div className="mt-12 border-t border-emerald-100 pt-8">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">Update Password</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InputField label="Current Password" type="password" editable />
              <InputField label="New Password" type="password" editable />
              <InputField label="Confirm Password" type="password" editable />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <Button className="bg-gradient-to-r from-emerald-500 to-yellow-500 text-white hover:from-emerald-600 hover:to-yellow-600 px-6 py-3 w-full sm:w-auto">
                Update Password
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2 px-6 py-3 w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const InputField = ({ label, value, editable, type = "text" }) => (
  <div className="flex flex-col w-full">
    <label className="text-emerald-700 font-medium mb-2">{label}</label>
    <Input
      type={type}
      defaultValue={value}
      disabled={!editable}
      className={`w-full ${
        editable ? "bg-white" : "bg-emerald-50"
      } border border-emerald-200 py-6`}
    />
  </div>
);
