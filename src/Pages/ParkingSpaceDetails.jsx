import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  DollarSign, 
  Clock, 
  Shield,
  ArrowLeft,
  CheckCircle,
  QrCode
} from "lucide-react";

export default function ParkingSpaceDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [parkingSpace, setParkingSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get spaceId from URL params
  const spaceId = searchParams.get("spaceId");

  useEffect(() => {
    loadMockData();
  }, [spaceId]);

  const loadMockData = async () => {
    setLoading(true);
    
    // Mock parking space data based on spaceId
    const mockSpaces = {
      "1": {
        id: 1,
        name: "Lekki Phase 1 Lot A",
        area: "Lekki",
        address: "Plot 123, Admiralty Way, Lekki Phase 1, Lagos",
        phone: "+234 809 123 4567",
        price_per_hour: 500,
        available_spaces: 12,
        total_spaces: 20,
        amenities: ["CCTV", "Security Guard", "Covered", "24/7 Access", "Well Lit"],
        image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop",
        description: "Premium parking lot in the heart of Lekki Phase 1 with 24/7 security and CCTV coverage.",
        status: "active"
      },
      "2": {
        id: 2,
        name: "Victoria Island Mall",
        area: "VI",
        address: "Ahmadu Bello Way, Victoria Island, Lagos",
        phone: "+234 809 987 6543",
        price_per_hour: 700,
        available_spaces: 5,
        total_spaces: 10,
        amenities: ["Covered", "Security Guard", "EV Charging", "Valet"],
        image_url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7e87?w=800&h=400&fit=crop",
        description: "Convenient mall parking with EV charging stations and valet service.",
        status: "active"
      },
      "3": {
        id: 3,
        name: "Ikeja City Center",
        area: "Ikeja",
        address: "Oba Akran Avenue, Ikeja, Lagos",
        phone: "+234 809 456 7890",
        price_per_hour: 400,
        available_spaces: 15,
        total_spaces: 25,
        amenities: ["CCTV", "EV Charging", "Car Wash", "Wheelchair Access", "Restroom"],
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
        description: "Large capacity parking with modern amenities including car wash and EV charging.",
        status: "active"
      }
    };

    // Set mock data based on spaceId or default to first one
    if (spaceId && mockSpaces[spaceId]) {
      setParkingSpace(mockSpaces[spaceId]);
    } else {
      // Default to first space if no valid spaceId
      setParkingSpace(mockSpaces["1"]);
    }

    setLoading(false);
  };

  const handleBookNow = () => {
    navigate("/dashboard/scan-qr");
  };

  const handleGoBack = () => {
    navigate("/dashboard/driver");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-yellow-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading parking details...</span>
        </div>
      </div>
    );
  }

  if (!parkingSpace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-yellow-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parking Space Not Found</h2>
          <Button onClick={handleGoBack} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    "CCTV": "📹",
    "Security Guard": "👮",
    "Covered": "🏠",
    "EV Charging": "⚡",
    "Car Wash": "🚿",
    "Valet": "🔑",
    "24/7 Access": "🕐",
    "Well Lit": "💡",
    "Wheelchair Access": "♿",
    "Restroom": "🚻"
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-emerald-50 to-yellow-50">
      <div className="w-full">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Full-width Card - No max-width constraint */}
        <Card className="w-full shadow-2xl overflow-hidden">
          {/* Image Section */}
          {parkingSpace.image_url && (
            <div className="h-64 overflow-hidden bg-gray-200">
              <img
                src={parkingSpace.image_url}
                alt={parkingSpace.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.className = 'h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center';
                  e.target.parentNode.innerHTML = '<div class="text-gray-500 text-lg">No Image Available</div>';
                }}
              />
            </div>
          )}

          {/* Header */}
          <CardHeader className="border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2">{parkingSpace.name}</CardTitle>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {parkingSpace.area}
                </p>
                {parkingSpace.description && (
                  <p className="text-gray-500 mt-2">{parkingSpace.description}</p>
                )}
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 text-lg px-4 py-2 whitespace-nowrap">
                {parkingSpace.available_spaces} of {parkingSpace.total_spaces} spots
              </Badge>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Location Details */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Location Details
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed">{parkingSpace.address}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a 
                      href={`tel:${parkingSpace.phone}`} 
                      className="hover:text-emerald-600 text-sm font-medium"
                    >
                      {parkingSpace.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Pricing
                </h3>
                <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 p-6 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      ₦{parkingSpace.price_per_hour.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/hour</span>
                  </div>
                  <p className="text-sm text-gray-600">Pay only for the time you use. No hidden fees.</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {parkingSpace.amenities && parkingSpace.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Facilities & Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {parkingSpace.amenities.map(amenity => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="text-xl flex-shrink-0">
                        {amenityIcons[amenity] || "✓"}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Park */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                How to Park Here
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600 w-6 flex-shrink-0">1.</span>
                  <span>Drive to <strong>{parkingSpace.name}</strong> using the address above</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600 w-6 flex-shrink-0">2.</span>
                  <span>Find the QR code at the entrance or on the parking signboard</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600 w-6 flex-shrink-0">3.</span>
                  <span>Scan the QR code to check-in and start your parking session</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600 w-6 flex-shrink-0">4.</span>
                  <span>Park your vehicle in an available spot</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600 w-6 flex-shrink-0">5.</span>
                  <span>Scan again when leaving to checkout and complete payment</span>
                </li>
              </ol>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-lg py-6 text-white font-semibold shadow-lg"
              onClick={handleBookNow}
              size="lg"
            >
              <QrCode className="w-5 h-5 mr-3" />
              Scan QR Code to Check In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}