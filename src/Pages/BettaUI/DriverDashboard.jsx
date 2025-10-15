
import React, { useState, useEffect } from "react";
import { ParkingSpace, ParkingSession } from "@/entities/all";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, DollarSign, Shield, Search, QrCode } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [reservedSessions, setReservedSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(null); // Added for reservation loading state

  const lagosCenter = [6.5244, 3.3792];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await User.me();
    setUser(currentUser);

    const spaces = await ParkingSpace.filter({ status: "active" });
    setParkingSpaces(spaces);

    const sessions = await ParkingSession.filter({
      driver_id: currentUser.id,
      status: "active"
    });
    if (sessions.length > 0) {
      setActiveSession(sessions[0]);
    }

    const reserved = await ParkingSession.filter({
      driver_id: currentUser.id,
      status: "reserved"
    });
    setReservedSessions(reserved);

    setLoading(false);
  };

  const handleReserveSpot = async (space) => {
    if (!user || !user.id) {
      alert("Please log in to reserve a spot.");
      return;
    }
    if (!user.vehicle_plate) {
      alert("Please update your vehicle plate number in your profile first to reserve a spot.");
      // Optionally navigate to profile page
      // navigate(createPageUrl("Profile"));
      return;
    }

    setReserving(space.id);
    try {
      const bookingCode = `EPK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Assuming operator_id is available on the parking space and refers to a User entity
      let operatorEmail = null;
      if (space.operator_id) {
        const operators = await User.filter({ id: space.operator_id });
        if (operators.length > 0) {
          operatorEmail = operators[0].email;
        }
      }

      await ParkingSession.create({
        parking_space_id: space.id,
        parking_space_name: space.name,
        parking_space_address: space.address,
        driver_id: user.id,
        driver_name: user.full_name,
        driver_email: user.email,
        driver_phone: user.phone,
        vehicle_plate: user.vehicle_plate,
        hourly_rate: space.price_per_hour,
        status: "reserved",
        payment_status: "pending",
        operator_id: space.operator_id,
        operator_email: operatorEmail,
        booking_code: bookingCode,
        reserved_at: new Date().toISOString()
      });

      await loadData(); // Reload data to show new reservation
      alert(`Spot reserved successfully! Your booking code is: ${bookingCode}`);
    } catch (err) {
      console.error("Reservation error:", err);
      alert("Failed to reserve spot. Please try again.");
    }
    setReserving(null);
  };

  const filteredSpaces = parkingSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "all" || space.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const areas = ["all", ...new Set(parkingSpaces.map(s => s.area))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading parking spaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Parking</h1>
            <p className="text-gray-600 mt-1">Discover available spots near you</p>
          </div>
          {/* Removed original QR code button as per outline, now it's part of the How It Works flow */}
        </div>

        {reservedSessions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Your Reservations</h2>
            <div className="space-y-3">
              {reservedSessions.map(session => (
                <Card key={session.id} className="border-blue-300 bg-blue-50 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-blue-100 text-blue-700">Reserved</Badge>
                          <h3 className="font-semibold text-lg">{session.parking_space_name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{session.parking_space_address}</p>
                        <p className="text-xs text-gray-500">
                          Code: <span className="font-mono font-semibold">{session.booking_code}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reserved on: {new Date(session.reserved_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(createPageUrl("MyBookings"))} // Navigates to MyBookings for check-in
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Check In
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSession && (
          <Card className="mb-6 border-emerald-300 bg-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Active Parking Session</h3>
                  <p className="text-gray-600">{activeSession.parking_space_name}</p>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("ActiveSession"))}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  View Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle>Parking Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] rounded-b-lg overflow-hidden">
                  <MapContainer
                    center={lagosCenter}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredSpaces.map((space) => (
                      space.latitude && space.longitude && (
                        <Marker
                          key={space.id}
                          position={[space.latitude, space.longitude]}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold">{space.name}</h3>
                              <p className="text-sm text-gray-600">{space.area}</p>
                              <p className="text-sm font-medium text-emerald-600 mt-1">
                                ₦{space.price_per_hour}/hour
                              </p>
                              <Button
                                size="sm"
                                className="mt-2 w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleReserveSpot(space)}
                                disabled={reserving === space.id}
                              >
                                {reserving === space.id ? "Reserving..." : "Reserve Spot"}
                              </Button>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name or area..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {areas.map(area => (
                      <Button
                        key={area}
                        variant={selectedArea === area ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedArea(area)}
                        className={selectedArea === area ? "bg-emerald-600" : ""}
                      >
                        {area === "all" ? "All Areas" : area}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSpaces.map(space => (
                    <Card
                      key={space.id}
                      // Removed onClick for whole card navigation as per new flow
                      className="hover:shadow-lg transition-shadow border-emerald-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{space.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {space.area}
                            </p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            {space.available_spaces || space.total_spaces} spots
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1 font-semibold text-emerald-600">
                            <DollarSign className="w-4 h-4" />
                            ₦{space.price_per_hour}/hr
                          </span>
                          {space.amenities?.slice(0, 2).map(amenity => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleReserveSpot(space)}
                          disabled={reserving === space.id}
                        >
                          {reserving === space.id ? "Reserving..." : "Reserve Spot"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium">Available Spots</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">
                    {parkingSpaces.reduce((sum, s) => sum + (s.available_spaces || s.total_spaces), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium">Locations</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">
                    {parkingSpaces.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Reserve Spot</h4>
                    <p className="text-sm text-gray-600">Click "Reserve Spot" on a preferred parking space</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-emerald-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Check In</h4>
                    <p className="text-sm text-gray-600">Arrive at the parking space and Check In to start timer</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Check Out</h4>
                    <p className="text-sm text-gray-600">When leaving, Check Out and pay for time used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
