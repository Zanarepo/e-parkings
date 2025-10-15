import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ParkingSpace } from "@/entities/ParkingSpace";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle } from "lucide-react";

const AMENITIES = [
  "CCTV",
  "Security Guard",
  "Covered",
  "EV Charging",
  "Car Wash",
  "Valet",
  "24/7 Access",
  "Well Lit",
  "Wheelchair Access",
  "Restroom"
];

const AREAS = [
  "Victoria Island",
  "Ikeja",
  "Lekki Phase 1",
  "Lekki Phase 2",
  "Ikoyi",
  "Yaba",
  "Surulere",
  "Ajah",
  "Festac",
  "Mainland",
  "Other"
];

const AREA_BASE_PRICES = {
  "Victoria Island": 600,
  "Ikeja": 500,
  "Lekki Phase 1": 550,
  "Lekki Phase 2": 500,
  "Ikoyi": 600,
  "Yaba": 400,
  "Surulere": 400,
  "Ajah": 350,
  "Festac": 350,
  "Mainland": 350,
  "Other": 400
};

export default function AddParkingSpace() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    address: "",
    phone: "",
    total_spaces: "",
    amenities: [],
    price_per_hour: "",
    latitude: "",
    longitude: ""
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData(prev => ({ ...prev, phone: currentUser.phone || "" }));
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Failed to load user data");
    }
  };

  const getSuggestedPrice = () => {
    if (!formData.area) return 400;
    const basePrice = AREA_BASE_PRICES[formData.area] || 400;
    const amenityBonus = formData.amenities.length * 25;
    return basePrice + amenityBonus;
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const qrCode = `EPARK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const spaceData = {
        name: formData.name,
        area: formData.area,
        address: formData.address,
        phone: formData.phone,
        operator_id: user.id,
        operator_name: user.business_name || user.full_name,
        total_spaces: parseInt(formData.total_spaces),
        available_spaces: parseInt(formData.total_spaces),
        price_per_hour: parseFloat(formData.price_per_hour),
        amenities: formData.amenities,
        qr_code: qrCode,
        status: "active"
      };

      if (formData.latitude && formData.latitude !== "") {
        spaceData.latitude = parseFloat(formData.latitude);
      }
      if (formData.longitude && formData.longitude !== "") {
        spaceData.longitude = parseFloat(formData.longitude);
      }

      await ParkingSpace.create(spaceData);

      setSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("OperatorDashboard"));
      }, 2000);
    } catch (err) {
      console.error("Error creating parking space:", err);
      setError("Failed to create parking space. Please try again.");
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
         <div className="max-w-6xl mx-auto">
           <Button
             variant="outline"
             onClick={() => navigate(createPageUrl("OperatorDashboard"))}
             className="mb-6"
           >
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Dashboard
           </Button>
           
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
            <CardTitle className="text-2xl">Add New Parking Space</CardTitle>
            <p className="text-gray-600 mt-2">Fill in the details about your parking location</p>
          </CardHeader>

          <CardContent className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-emerald-300 bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800">
                  Parking space added successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Parking Lot Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., City Mall Parking"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="area">Area *</Label>
                <Select
                  value={formData.area}
                  onValueChange={(value) => setFormData({ ...formData, area: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address with landmarks..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Contact Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+234 801 234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Drivers will use this to contact you for directions
                </p>
              </div>

              <div>
                <Label htmlFor="spaces">Total Parking Spaces *</Label>
                <Input
                  id="spaces"
                  type="number"
                  placeholder="10"
                  min="1"
                  value={formData.total_spaces}
                  onChange={(e) => setFormData({ ...formData, total_spaces: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label className="mb-3 block">Amenities & Facilities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITIES.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="price">Price per Hour (₦) *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, price_per_hour: getSuggestedPrice().toString() })}
                  >
                    Use Suggested: ₦{getSuggestedPrice()}
                  </Button>
                </div>
                <Input
                  id="price"
                  type="number"
                  placeholder="500"
                  min="100"
                  step="50"
                  value={formData.price_per_hour}
                  onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                  required
                />
                {formData.area && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Pricing tip: Based on your selected area ({formData.area}) and {formData.amenities.length} amenities, 
                    we suggest ₦{getSuggestedPrice()}/hour. Premium locations and more facilities justify higher prices.
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude (optional)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="6.5244"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (optional)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="3.3792"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("OperatorDashboard"))}
                  className="flex-1"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600"
                >
                  {saving ? "Adding..." : "Add Parking Space"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}