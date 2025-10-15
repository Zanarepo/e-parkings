import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  Activity,
  Copy,
  Power,
  QrCodeIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ManageSpace() {
  const navigate = useNavigate();

  // ---- Mock Data ----
  const [parkingSpace, setParkingSpace] = useState({
    id: 1,
    name: "Downtown Plaza Car Park",
    area: "Lekki Phase 1",
    address: "10 Admiralty Way, Lagos",
    qr_code: "PARK-9082",
    status: "active",
    total_spaces: 50,
    available_spaces: 32,
  });

  const [sessions, setSessions] = useState([
    {
      id: 1,
      driver_name: "John Doe",
      vehicle_plate: "ABC-123-LAG",
      check_in_time: new Date(),
      status: "active",
      hourly_rate: 500,
      operator_earnings: 2500,
      total_amount: 3000,
      total_hours: 5,
    },
    {
      id: 2,
      driver_name: "Sarah James",
      vehicle_plate: "XYZ-444-LAG",
      check_in_time: new Date(Date.now() - 3600000),
      check_out_time: new Date(),
      status: "completed",
      hourly_rate: 600,
      operator_earnings: 3000,
      total_amount: 3500,
      total_hours: 6,
    },
  ]);

  const [activeSessions, setActiveSessions] = useState(
    sessions.filter((s) => s.status === "active")
  );

  const toggleSpaceStatus = () => {
    const newStatus = parkingSpace.status === "active" ? "inactive" : "active";
    setParkingSpace({ ...parkingSpace, status: newStatus });
  };

  const copyQRCode = () => {
    navigator.clipboard.writeText(parkingSpace.qr_code);
    alert("Check-in code copied to clipboard!");
  };

  const getTodayRevenue = () => {
    return sessions
      .filter((s) => s.status === "completed")
      .reduce((sum, s) => sum + (s.operator_earnings || 0), 0);
  };

  const getTotalRevenue = () => {
    return sessions.reduce(
      (sum, s) => sum + (s.operator_earnings || 0),
      0
    );
  };

  const getOccupancyRate = () => {
    const occupied =
      parkingSpace.total_spaces - (parkingSpace.available_spaces || 0);
    return parkingSpace.total_spaces > 0
      ? ((occupied / parkingSpace.total_spaces) * 100).toFixed(1)
      : "0.0";
  };

  // ---- UI Render ----
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Spaces
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {parkingSpace.name}
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {parkingSpace.area} - {parkingSpace.address}
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-300"
                >
                  <QrCodeIcon className="w-4 h-4 mr-2" />
                  View Check-in Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Check-in Code</DialogTitle>
                  <DialogDescription>
                    Drivers can enter this code to check in or check out
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center py-6">
                  <div className="w-full p-8 bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-2xl border-4 border-emerald-500 shadow-xl">
                    <p className="text-sm text-gray-600 text-center mb-4 font-semibold">
                      PARKING CODE
                    </p>
                    <p className="text-3xl font-mono font-bold text-center break-all text-emerald-700 mb-6">
                      {parkingSpace.qr_code}
                    </p>
                    <Button
                      onClick={copyQRCode}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Display this code prominently at your parking entrance
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={toggleSpaceStatus}
              className={
                parkingSpace.status === "active"
                  ? "border-red-300"
                  : "border-emerald-300"
              }
            >
              <Power className="w-4 h-4 mr-2" />
              {parkingSpace.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-emerald-600" />
                <Badge
                  className={
                    parkingSpace.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {parkingSpace.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {getOccupancyRate()}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {parkingSpace.available_spaces}/{parkingSpace.total_spaces}{" "}
                available
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Activity className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900">
                {activeSessions.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Currently parking</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-yellow-600 mb-2" />
              <p className="text-sm text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{getTodayRevenue().toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Your net (85%)</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{getTotalRevenue().toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Session States */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="active">
              Active Now ({activeSessions.length})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Paused ({sessions.filter((s) => s.status === "paused").length})
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Sessions</TabsTrigger>
          </TabsList>

          {/* Active */}
          <TabsContent value="active">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Active Parking Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {activeSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeSessions.map((session) => (
                      <Card
                        key={session.id}
                        className="border-emerald-200 bg-emerald-50"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                                <div>
                                  <h4 className="font-semibold">
                                    {session.driver_name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {session.vehicle_plate}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-600">Check-in</p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(session.check_in_time),
                                      "h:mm a"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Hourly Rate</p>
                                  <p className="font-medium">
                                    ₦{session.hourly_rate}/hr
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700">
                              Active
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paused */}
          <TabsContent value="paused">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Paused Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No paused sessions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Completed Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions
                  .filter((s) => s.status === "completed")
                  .map((session) => (
                    <Card key={session.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              {session.driver_name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {session.vehicle_plate}
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Duration</p>
                                <p className="font-medium">
                                  {session.total_hours}h
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Total Paid</p>
                                <p className="font-medium">
                                  ₦{session.total_amount?.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">You Earned</p>
                                <p className="font-medium text-emerald-600">
                                  ₦{session.operator_earnings?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            {format(
                              new Date(),
                              "MMM d, h:mm a"
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All */}
          <TabsContent value="all">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Sessions ({sessions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.map((session) => (
                  <Card key={session.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {session.driver_name}
                            </h4>
                            <Badge
                              className={
                                session.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : session.status === "completed"
                                  ? "bg-gray-100 text-gray-700"
                                  : session.status === "paused"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {session.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {session.vehicle_plate}
                          </p>
                          <div className="text-xs text-gray-500">
                            {format(new Date(session.check_in_time), "MMM d, h:mm a")}
                          </div>
                        </div>
                        {session.operator_earnings && (
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">
                              ₦{session.operator_earnings.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              from ₦{session.total_amount.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
