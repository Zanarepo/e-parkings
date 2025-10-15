import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Calendar, ArrowLeft, Phone } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

// Mock sessions data with different statuses
const mockSessions = [
  {
    id: "session1",
    parking_space_id: "space1",
    parking_space_name: "Victoria Island Mall Parking",
    parking_space_address: "Victoria Island, Lagos",
    status: "reserved",
    booking_code: "EPK-1729000000000-ABC123",
    reserved_at: new Date().toISOString(),
    created_date: new Date().toISOString(),
    hourly_rate: 2000,
    vehicle_plate: "ABC-123-DEF",
    total_amount: null,
    total_hours: null,
    check_in_time: null,
    check_out_time: null,
    pause_time: null
  },
  {
    id: "session2",
    parking_space_id: "space2",
    parking_space_name: "Ikeja City Mall",
    parking_space_address: "Oba Akran Avenue, Ikeja",
    status: "active",
    booking_code: "EPK-1728900000000-DEF456",
    reserved_at: new Date(Date.now() - 3600000).toISOString(),
    created_date: new Date(Date.now() - 3600000).toISOString(),
    hourly_rate: 1500,
    vehicle_plate: "GHI-789-JKL",
    total_amount: null,
    total_hours: null,
    check_in_time: new Date(Date.now() - 1800000).toISOString(),
    check_out_time: null,
    pause_time: null
  },
  {
    id: "session3",
    parking_space_id: "space3",
    parking_space_name: "Lekki Phase 1 Lot",
    parking_space_address: "Admiralty Way, Lekki",
    status: "paused",
    booking_code: "EPK-1728800000000-GHI789",
    reserved_at: new Date(Date.now() - 7200000).toISOString(),
    created_date: new Date(Date.now() - 7200000).toISOString(),
    hourly_rate: 2500,
    vehicle_plate: "MNO-012-PQR",
    total_amount: null,
    total_hours: null,
    check_in_time: new Date(Date.now() - 5400000).toISOString(),
    check_out_time: null,
    pause_time: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "session4",
    parking_space_id: "space4",
    parking_space_name: "Yaba Tech Parking",
    parking_space_address: "Yaba, Lagos",
    status: "completed",
    booking_code: "EPK-1728700000000-JKL012",
    reserved_at: new Date(Date.now() - 86400000).toISOString(),
    created_date: new Date(Date.now() - 86400000).toISOString(),
    hourly_rate: 1000,
    vehicle_plate: "STU-345-VWX",
    total_amount: 3000,
    total_hours: 3,
    check_in_time: new Date(Date.now() - 86400000 - 10800000).toISOString(),
    check_out_time: new Date(Date.now() - 86400000).toISOString(),
    pause_time: null
  },
  {
    id: "session5",
    parking_space_id: "space1",
    parking_space_name: "Victoria Island Mall Parking",
    parking_space_address: "Victoria Island, Lagos",
    status: "cancelled",
    booking_code: "EPK-1728600000000-MNO345",
    reserved_at: new Date(Date.now() - 172800000).toISOString(),
    created_date: new Date(Date.now() - 172800000).toISOString(),
    hourly_rate: 2000,
    vehicle_plate: "YZA-678-BCD",
    total_amount: null,
    total_hours: null,
    check_in_time: null,
    check_out_time: null,
    pause_time: null,
    cancellation_time: new Date(Date.now() - 86400000).toISOString()
  }
];

// Mock parking spaces data
const mockParkingSpaces = {
  space1: { id: "space1", total_spaces: 50, available_spaces: 15, phone: "+234123456789" },
  space2: { id: "space2", total_spaces: 30, available_spaces: 8, phone: "+234987654321" },
  space3: { id: "space3", total_spaces: 20, available_spaces: 5, phone: "+234555666777" },
  space4: { id: "space4", total_spaces: 25, available_spaces: 12, phone: "+234888999000" }
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [resuming, setResuming] = useState(null);
  const [activeTab, setActiveTab] = useState("reserved"); // Track active tab state

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(mockSessions);
      setParkingSpaces(mockParkingSpaces);
      console.log("Sessions loaded:", mockSessions); // Debug log
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (session) => {
    setCheckingIn(session.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(prev =>
        prev.map(s =>
          s.id === session.id ? { ...s, status: "active", check_in_time: new Date().toISOString() } : s
        )
      );
      const space = parkingSpaces[session.parking_space_id];
      if (space) {
        const currentAvailable = space.available_spaces ?? space.total_spaces;
        const newAvailable = Math.max(0, currentAvailable - 1);
        setParkingSpaces(prev => ({
          ...prev,
          [session.parking_space_id]: { ...space, available_spaces: newAvailable }
        }));
      }
      await loadSessions();
      navigate("/dashboard/active-session");
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Failed to check in. Please try again.");
    } finally {
      setCheckingIn(null);
    }
  };

  const handleCancel = async (session) => {
    if (session.status === "reserved") {
      if (!confirm("Cancel this reservation? No charges will be applied.")) return;
      setCancelling(session.id);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSessions(prev =>
          prev.map(s =>
            s.id === session.id ? { ...s, status: "cancelled", cancellation_time: new Date().toISOString() } : s
          )
        );
        await loadSessions();
        alert("Reservation cancelled successfully. No charges applied.");
      } catch (err) {
        console.error("Cancellation error:", err);
        alert("Failed to cancel reservation. Please try again.");
      } finally {
        setCancelling(null);
      }
      return;
    }
    if (session.status === "active" && session.check_in_time) {
      const checkInTime = new Date(session.check_in_time);
      const currentTime = new Date();
      const minutesSinceCheckIn = differenceInMinutes(currentTime, checkInTime);
      if (minutesSinceCheckIn > 5) {
        alert("Cannot cancel after 5 minutes of check-in. Please checkout instead to pay for time used.");
        return;
      }
      if (!confirm("Cancel this parking session? No charges will be applied (within 5 minutes of check-in).")) return;
      setCancelling(session.id);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSessions(prev =>
          prev.map(s =>
            s.id === session.id ? { ...s, status: "cancelled", cancellation_time: new Date().toISOString() } : s
          )
        );
        const space = parkingSpaces[session.parking_space_id];
        if (space) {
          setParkingSpaces(prev => ({
            ...prev,
            [session.parking_space_id]: { ...space, available_spaces: (space.available_spaces || 0) + 1 }
          }));
        }
        await loadSessions();
        alert("Session cancelled successfully. No charges applied.");
      } catch (err) {
        console.error("Cancellation error:", err);
        alert("Failed to cancel session. Please try again.");
      } finally {
        setCancelling(null);
      }
    }
  };

  const handleResume = async (session) => {
    setResuming(session.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(prev =>
        prev.map(s =>
          s.id === session.id ? { ...s, status: "active", resume_time: new Date().toISOString() } : s
        )
      );
      await loadSessions();
      navigate("/dashboard/active-session");
    } catch (err) {
      console.error("Resume error:", err);
      alert("Failed to resume session. Please try again.");
    } finally {
      setResuming(null);
    }
  };

  const totalSpent = sessions
    .filter(s => s.status === "completed")
    .reduce((sum, s) => sum + (s.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">View your parking history</p>
          </div>
          {/* Back Button */}
          <Button variant="outline" onClick={() => navigate("/dashboard/driver")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">{sessions.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">₦{totalSpent.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reserved</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === "reserved").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Now</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reserved" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="reserved">Reserved ({sessions.filter(s => s.status === "reserved").length})</TabsTrigger>
            <TabsTrigger value="active">Active ({sessions.filter(s => s.status === "active").length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({sessions.filter(s => s.status === "paused").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="reserved">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Reserved Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.filter(s => s.status === "reserved").length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reserved bookings</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === "reserved")
                      .map(session => {
                        const space = parkingSpaces[session.parking_space_id];
                        return (
                          <Card key={session.id} className="border-blue-200 bg-blue-50">
                            <CardContent className="p-6">
                              <div className="mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge className="bg-blue-100 text-blue-700">Reserved</Badge>
                                  <h3 className="font-semibold text-xl">{session.parking_space_name}</h3>
                                </div>
                                <p className="text-gray-600 mb-1">{session.parking_space_address}</p>
                                {space?.phone && (
                                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                                    <Phone className="w-4 h-4" />
                                    <a href={`tel:${space.phone}`} className="hover:text-emerald-600 font-medium">
                                      {space.phone}
                                    </a>
                                  </p>
                                )}
                                <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
                                  <div>
                                    <p className="text-gray-500">Vehicle</p>
                                    <p className="font-semibold">{session.vehicle_plate}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Hourly Rate</p>
                                    <p className="font-semibold">₦{session.hourly_rate}/hr</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-gray-500">Booking Code</p>
                                    <p className="font-mono font-semibold text-blue-700">{session.booking_code}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-gray-500">Reserved At</p>
                                    <p className="font-semibold">
                                      {format(new Date(session.reserved_at || session.created_date), "MMM d, yyyy h:mm a")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <Button
                                  onClick={() => handleCheckIn(session)}
                                  disabled={checkingIn === session.id}
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                  {checkingIn === session.id ? "Checking In..." : "Check In"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    window.open(
                                      `https://maps.google.com/?q=${encodeURIComponent(session.parking_space_address)}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  Navigate
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleCancel(session)}
                                  disabled={cancelling === session.id}
                                >
                                  {cancelling === session.id ? "Cancelling..." : "Cancel"}
                                </Button>
                              </div>
                              <p className="text-xs text-green-600 mt-2 text-center">
                                ✓ Free cancellation available anytime before check-in
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Active Parking Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.filter(s => s.status === "active").length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === "active")
                      .map(session => (
                        <Card key={session.id} className="border-emerald-200 bg-emerald-50">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                                  <div>
                                    <h4 className="font-semibold text-lg">{session.parking_space_name}</h4>
                                    <p className="text-sm text-gray-600">{session.vehicle_plate}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Started: {session.check_in_time ? format(new Date(session.check_in_time), "MMM d, h:mm a") : "N/A"}
                                </p>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                            </div>
                            <Button
                              onClick={() => navigate("/dashboard/active-session")}
                              className="w-full bg-emerald-600 hover:bg-emerald-700"
                            >
                              View Active Session
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paused">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Paused Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.filter(s => s.status === "paused").length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No paused sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === "paused")
                      .map(session => (
                        <Card key={session.id} className="border-purple-200 bg-purple-50">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                                  <div>
                                    <h4 className="font-semibold text-lg">{session.parking_space_name}</h4>
                                    <p className="text-sm text-gray-600">{session.vehicle_plate}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Paused: {session.pause_time ? format(new Date(session.pause_time), "MMM d, h:mm a") : "N/A"}
                                </p>
                              </div>
                              <Badge className="bg-purple-100 text-purple-700">Paused</Badge>
                            </div>
                            <Button
                              onClick={() => handleResume(session)}
                              disabled={resuming === session.id}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              {resuming === session.id ? "Resuming..." : "Resume Session"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Completed Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.filter(s => s.status === "completed").length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No completed bookings</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === "completed")
                      .map(session => (
                        <Card key={session.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{session.parking_space_name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{session.parking_space_address}</p>
                                <div className="text-sm text-gray-500">
                                  {session.check_in_time && format(new Date(session.check_in_time), "MMM d, h:mm a")} - 
                                  {session.check_out_time && format(new Date(session.check_out_time), "h:mm a")}
                                </div>
                              </div>
                              <div className="text-right">
                                {session.total_amount ? (
                                  <>
                                    <p className="text-2xl font-bold text-emerald-600">
                                      ₦{session.total_amount.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">{session.total_hours} hour(s)</p>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Sessions ({sessions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map(session => (
                      <Card key={session.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{session.parking_space_name}</h4>
                                <Badge
                                  className={
                                    session.status === "reserved"
                                      ? "bg-blue-100 text-blue-700"
                                      : session.status === "active"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : session.status === "paused"
                                      ? "bg-purple-100 text-purple-700"
                                      : session.status === "completed"
                                      ? "bg-gray-100 text-gray-700"
                                      : session.status === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }
                                >
                                  {session.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{session.parking_space_address}</p>
                            </div>
                            {session.total_amount ? (
                              <div className="text-right">
                                <p className="font-semibold text-emerald-600">₦{session.total_amount.toFixed(2)}</p>
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}