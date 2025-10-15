import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Car, Info } from "lucide-react";
import { format } from "date-fns";

const PLATFORM_COMMISSION_RATE = 0.15; // 15%

export default function ActiveSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [estimatedCommission, setEstimatedCommission] = useState(0);
  const [estimatedOperatorEarnings, setEstimatedOperatorEarnings] = useState(0);
  const [cancelling, setCancelling] = useState(false);
  const [pausing, setPausing] = useState(false);

  // Mock session data for testing
  const mockSession = {
    id: 1,
    driver_id: 101,
    driver_name: "John Doe",
    driver_email: "johndoe@example.com",
    operator_id: 201,
    operator_email: "operator@example.com",
    vehicle_plate: "ABC-1234",
    parking_space_id: 301,
    parking_space_name: "Downtown Parking Lot",
    parking_space_address: "123 Main St, Lagos",
    check_in_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
    hourly_rate: 500,
    status: "active",
  };

  useEffect(() => {
    // Load mock session
    setSession(mockSession);
  }, []);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const checkInTime = new Date(session.check_in_time);
      const now = new Date();
      const diff = now - checkInTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime({ hours, minutes, seconds });

      const totalHours = Math.ceil(diff / (1000 * 60 * 60));
      const total = totalHours * session.hourly_rate;
      const commission = total * PLATFORM_COMMISSION_RATE;
      const operatorEarnings = total - commission;

      setEstimatedTotal(total);
      setEstimatedCommission(commission);
      setEstimatedOperatorEarnings(operatorEarnings);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Mock handlers
  const handleCheckout = () => {
    alert(`✅ Checkout Successful!\n\nDuration: ${Math.ceil(
      (elapsedTime.hours * 60 + elapsedTime.minutes + elapsedTime.seconds / 60) / 60
    )} hour(s)\nTotal: ₦${estimatedTotal.toFixed(2)}`);
  };

  const handlePauseSession = () => {
    alert("Session paused successfully!");
  };

  const handleCancelSession = () => {
    alert("Session cancelled successfully!");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          <span className="text-gray-600">Loading session...</span>
        </div>
      </div>
    );
  }

  const billingHours = Math.ceil((elapsedTime.hours * 60 + elapsedTime.minutes + elapsedTime.seconds / 60) / 60);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="bg-emerald-100 text-emerald-700 mb-4 text-lg px-6 py-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse mr-2" />
            Active Parking Session
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900">Parking in Progress</h1>
          <p className="text-gray-600 mt-2">Your timer is running</p>
        </div>

        <Card className="shadow-2xl mb-6 border-2 border-emerald-300 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 p-1">
            <div className="bg-white p-8">
              <CardTitle className="text-center text-5xl md:text-6xl font-mono font-bold text-gray-900 mb-2">
                {String(elapsedTime.hours).padStart(2, "0")}:
                {String(elapsedTime.minutes).padStart(2, "0")}:
                {String(elapsedTime.seconds).padStart(2, "0")}
              </CardTitle>
              <p className="text-center text-gray-600 text-lg">Time Elapsed</p>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Location
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-lg">{session.parking_space_name}</p>
                    <p className="text-sm text-gray-600">{session.parking_space_address}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Check-in Time</p>
                      <p className="font-medium">
                        {format(new Date(session.check_in_time), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-medium">{session.vehicle_plate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Billing Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-semibold">₦{session.hourly_rate}/hour</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Billable Hours</span>
                    <span className="font-semibold">{billingHours} hour(s)</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-yellow-50 rounded-lg border-2 border-emerald-300">
                    <span className="font-semibold text-lg">You Pay</span>
                    <span className="font-bold text-3xl text-emerald-600">
                      ₦{estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Billing Information</p>
                  <p>• Time is billed in full hours (rounded up)</p>
                  <p>• You pay the full amount displayed</p>
                  <p>• Operator receives 85% (₦{estimatedOperatorEarnings.toFixed(2)})</p>
                  <p>• Platform keeps 15% for service (₦{estimatedCommission.toFixed(2)})</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-r from-emerald-500 to-yellow-500 text-white mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-xl mb-3">Ready to Leave?</h3>
            <p className="text-white/90 mb-4">Click the button below to end your parking session</p>
            <div className="space-y-3">
              <Button
                className="w-full bg-white text-emerald-600 hover:bg-gray-100 text-lg py-6"
                onClick={handleCheckout}
              >
                End Parking & Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-white text-white hover:bg-white/10"
                onClick={handlePauseSession}
              >
                Pause Session
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-white text-white hover:bg-white/10"
                onClick={handleCancelSession}
              >
                Cancel Parking Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate(createPageUrl("DriverDashboard"))}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
