import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ParkingSpace, ParkingSession } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Phone,
  DollarSign,
  Edit,
  QrCode as QrCodeIcon,
  Copy
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MySpaces() {
  const navigate = useNavigate();
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await User.me();
    const spaces = await ParkingSpace.filter({ operator_id: user.id });
    setParkingSpaces(spaces);

    const allSessions = await ParkingSession.filter({ operator_id: user.id }, "-created_date");
    setSessions(allSessions);

    setLoading(false);
  };

  const copyQRCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("QR code copied to clipboard!");
  };

  const getSpaceRevenue = (spaceId) => {
    return sessions
      .filter(s => s.parking_space_id === spaceId && s.status === "completed")
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading spaces...</span>
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

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Parking Spaces</h1>
            <p className="text-gray-600 mt-1">Manage your parking locations</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {parkingSpaces.map(space => (
            <Card
              key={space.id}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{space.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                      <MapPin className="w-4 h-4" />
                      {space.area}
                    </p>
                  </div>
                  <Badge className={space.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                    {space.available_spaces || space.total_spaces}/{space.total_spaces} available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-semibold text-emerald-600">₦{space.price_per_hour}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold">₦{getSpaceRevenue(space.id).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Sessions</span>
                    <span className="font-semibold">
                      {sessions.filter(s => s.parking_space_id === space.id && s.status === "active").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className={space.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                      {space.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <QrCodeIcon className="w-4 h-4 mr-2" />
                        View QR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{space.name}</DialogTitle>
                        <DialogDescription>
                          Drivers scan or enter this code to check in/out
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center py-6">
                        <div className="w-full p-6 bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-2xl border-4 border-emerald-500 shadow-xl">
                          <p className="text-sm text-gray-600 text-center mb-3 font-semibold">PARKING CODE</p>
                          <p className="text-2xl font-mono font-bold text-center break-all text-emerald-700 mb-4">
                            {space.qr_code}
                          </p>
                          <Button
                            onClick={() => copyQRCode(space.qr_code)}
                            variant="outline"
                            className="w-full"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                          Print this code and display it at your parking entrance
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => navigate(createPageUrl(`ManageSpace?id=${space.id}`))}
                  >
                    Manage Space
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}