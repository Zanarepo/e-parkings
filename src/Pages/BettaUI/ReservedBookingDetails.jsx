
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  QrCode, 
  DollarSign,
  ArrowLeft,
  Camera,
  Hash,
  Play,
  XCircle,
  Phone // Added Phone icon import
} from "lucide-react";
import { format } from "date-fns";

const PLATFORM_COMMISSION_RATE = 0.15;

export default function ReservedBookingDetails() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [parkingSpace, setParkingSpace] = useState(null); // Added parkingSpace state
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("id");

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const sessions = await base44.entities.ParkingSession.filter({ id: sessionId });
      if (sessions.length > 0 && sessions[0].status === "reserved") {
        setSession(sessions[0]);
        
        // Fetch parking space details
        const spaces = await base44.entities.ParkingSpace.filter({ id: sessions[0].parking_space_id });
        if (spaces.length > 0) {
          setParkingSpace(spaces[0]);
        }
      } else {
        navigate(createPageUrl("MyBookings"));
      }
    } catch (error) {
      console.error("Failed to load session or parking space:", error);
      alert("Failed to load reservation details.");
      navigate(createPageUrl("MyBookings")); // Redirect on error
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!confirm("Cancel this reservation?")) return;

    setCancelling(true);
    try {
      await base44.entities.ParkingSession.update(session.id, {
        status: "cancelled"
      });

      await base44.entities.Notification.create({
        user_id: session.driver_id,
        title: "Reservation Cancelled",
        message: `Your reservation at ${session.parking_space_name} was cancelled`,
        type: "alert"
      });

      navigate(createPageUrl("MyBookings"));
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel reservation.");
      setCancelling(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("MyBookings"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="bg-blue-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{session.parking_space_name}</CardTitle>
                <p className="text-gray-600">{session.parking_space_address}</p>
                {parkingSpace?.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${parkingSpace.phone}`} className="hover:text-emerald-600">
                      {parkingSpace.phone}
                    </a>
                  </p>
                )}
              </div>
              <Badge className="bg-blue-100 text-blue-700 text-lg px-4 py-2">Reserved</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                <p className="font-semibold text-lg">{session.vehicle_plate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                <p className="font-semibold text-lg">₦{session.hourly_rate}/hr</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reserved On</p>
                <p className="font-semibold">{format(new Date(session.reserved_at), "MMM d, yyyy h:mm a")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking Code</p>
                <p className="font-mono font-semibold text-blue-700">{session.booking_code}</p>
              </div>
            </div>

            {parkingSpace?.phone && (
              <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-yellow-600" />
                  Need Directions?
                </h4>
                <p className="text-sm text-gray-700">
                  Call the parking lot at{" "}
                  <a 
                    href={`tel:${parkingSpace.phone}`} 
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {parkingSpace.phone}
                  </a>
                  {" "}if you need help finding the location
                </p>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mb-6">
              <h4 className="font-semibold text-lg mb-3">Important Information</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>This spot is reserved for you</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Navigate to the location when ready</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Click "Check In" when you arrive to start the timer</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>You'll only pay for the time you actually park</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-emerald-800">
                <DollarSign className="w-4 h-4 inline mr-2" />
                <strong>Estimated Cost: ₦0.00</strong>
                <br />
                <span className="text-xs">Timer starts when you check in. Final bill = Actual parking time × ₦{session.hourly_rate}/hour</span>
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleCancelReservation}
              disabled={cancelling}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {cancelling ? "Cancelling..." : "Cancel Reservation"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
