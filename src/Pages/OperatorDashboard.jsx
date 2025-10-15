import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Building2,
  TrendingUp,
  Clock,
  PlusCircle,
  Users,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

const PLATFORM_COMMISSION_RATE = 0.15; // 15%

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Mock Data
  const mockUser = {
    id: 1,
    full_name: "John Doe",
    business_name: "Downtown Parking Ltd",
  };

  const mockSpaces = [
    {
      id: 1,
      name: "Downtown Parking Lot",
      area: "Ikeja, Lagos",
      total_spaces: 50,
      available_spaces: 12,
      status: "active",
    },
    {
      id: 2,
      name: "Victoria Island Car Park",
      area: "Victoria Island, Lagos",
      total_spaces: 100,
      available_spaces: 80,
      status: "active",
    },
  ];

  const mockSessions = [
    {
      id: 101,
      driver_name: "Emeka O.",
      parking_space_name: "Downtown Parking Lot",
      check_in_time: "2025-10-10T09:00:00",
      check_out_time: "2025-10-10T11:00:00",
      status: "completed",
      total_amount: 2000,
      operator_earnings: 1700,
      platform_commission: 300,
    },
    {
      id: 102,
      driver_name: "Amina B.",
      parking_space_name: "Victoria Island Car Park",
      check_in_time: "2025-10-11T08:00:00",
      status: "active",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setUser(mockUser);
      setParkingSpaces(mockSpaces);
      setSessions(mockSessions);
      setLoading(false);
    }, 600);
  }, []);

  const totalRevenue = sessions
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + (s.total_amount || 0), 0);

  const operatorEarnings = sessions
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + (s.operator_earnings || 0), 0);

  const platformCommission = sessions
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + (s.platform_commission || 0), 0);

  const todayRevenue = sessions
    .filter((s) => {
      if (s.status !== "completed" || !s.check_out_time) return false;
      const today = new Date().toDateString();
      return new Date(s.check_out_time).toDateString() === today;
    })
    .reduce((sum, s) => sum + (s.total_amount || 0), 0);

  const todayEarnings = sessions
    .filter((s) => {
      if (s.status !== "completed" || !s.check_out_time) return false;
      const today = new Date().toDateString();
      return new Date(s.check_out_time).toDateString() === today;
    })
    .reduce((sum, s) => sum + (s.operator_earnings || 0), 0);

  const activeSessions = sessions.filter((s) => s.status === "active").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operator Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.business_name || user?.full_name}
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/add-parkingspace")}
            className="bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Parking Space
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-600">Your Net Earnings</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                ₦{operatorEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                85% of ₦{totalRevenue.toFixed(2)} total revenue
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Today's Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ₦{todayEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                From ₦{todayRevenue.toFixed(2)} total revenue
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₦{platformCommission.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">15% platform fee (all time)</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeSessions}</p>
              <p className="text-xs text-gray-500 mt-2">Currently parking</p>
            </CardContent>
          </Card>
        </div>

        {/* Commission Info */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Commission Structure
          </h3>
          <p className="text-sm text-blue-800">
            • You earn <strong>85%</strong> of all parking fees
            <br />
            • Platform takes <strong>15%</strong> commission for maintenance & payments
          </p>
        </div>

        {/* Parking Spaces & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Parking Spaces</CardTitle>
            </CardHeader>
            <CardContent>
              {parkingSpaces.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No parking spaces yet</p>
                  <Button
                    onClick={() => navigate("/dashboard/add-parkingspace")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Your First Space
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {parkingSpaces.map((space) => (
                    <div
                      key={space.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate("/dashboard/manage-space")}
                    >
                      <div>
                        <p className="font-semibold">{space.name}</p>
                        <p className="text-sm text-gray-600">{space.area}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={
                              space.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {space.status}
                          </Badge>
                          {sessions.filter(
                            (s) =>
                              s.parking_space_name === space.name &&
                              s.status === "active"
                          ).length > 0 && (
                            <Badge className="bg-blue-100 text-blue-700">
                              {
                                sessions.filter(
                                  (s) =>
                                    s.parking_space_name === space.name &&
                                    s.status === "active"
                                ).length
                              }{" "}
                              active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">
                          {space.available_spaces}/{space.total_spaces}
                        </p>
                        <p className="text-xs text-gray-500">available</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No sessions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{session.driver_name}</p>
                        <p className="text-sm text-gray-600">
                          {session.parking_space_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(session.check_in_time), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <div className="text-right">
                        {session.operator_earnings ? (
                          <>
                            <p className="font-semibold text-emerald-600">
                              ₦{session.operator_earnings.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              from ₦{session.total_amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-purple-600">
                              -₦{session.platform_commission.toFixed(2)} fee
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                            <span className="text-xs text-emerald-600">active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
