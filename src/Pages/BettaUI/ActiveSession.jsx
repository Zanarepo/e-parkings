import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Car, QrCode, Info, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const PLATFORM_COMMISSION_RATE = 0.15;

export default function ActiveSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [estimatedCommission, setEstimatedCommission] = useState(0);
  const [estimatedOperatorEarnings, setEstimatedOperatorEarnings] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!session || session.status === "paused") return;

    const interval = setInterval(() => {
      const checkInTime = new Date(session.check_in_time);
      const now = new Date();
      const diff = now - checkInTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime({ hours, minutes, seconds });

      // Check if past 5 minute cancellation window
      const minutesElapsed = diff / (1000 * 60);
      setCanCancel(minutesElapsed <= 5);

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

  const loadSession = async () => {
    const user = await base44.auth.me();
    const sessions = await base44.entities.ParkingSession.filter({
      driver_id: user.id,
      status: "active"
    });

    if (sessions.length === 0) {
      // Check for paused session
      const pausedSessions = await base44.entities.ParkingSession.filter({
        driver_id: user.id,
        status: "paused"
      });
      
      if (pausedSessions.length > 0) {
        setSession(pausedSessions[0]);
      } else {
        navigate(createPageUrl("DriverDashboard"));
      }
      return;
    }

    setSession(sessions[0]);
  };

  const handleCheckout = async () => {
    if (!confirm("Are you sure you want to checkout and end this parking session?")) return;

    setProcessing(true);
    try {
      const checkOutTime = new Date();
      const checkInTime = new Date(session.check_in_time);
      
      const timeDiffMs = checkOutTime - checkInTime;
      const totalHours = Math.ceil(timeDiffMs / (1000 * 60 * 60));
      
      const totalAmount = totalHours * session.hourly_rate;
      const platformCommission = totalAmount * PLATFORM_COMMISSION_RATE;
      const operatorEarnings = totalAmount - platformCommission;

      await base44.entities.ParkingSession.update(session.id, {
        check_out_time: checkOutTime.toISOString(),
        total_hours: totalHours,
        total_amount: totalAmount,
        platform_commission: platformCommission,
        operator_earnings: operatorEarnings,
        status: "completed",
        payment_status: "paid"
      });

      const spaces = await base44.entities.ParkingSpace.filter({ id: session.parking_space_id });
      if (spaces.length > 0) {
        const space = spaces[0];
        await base44.entities.ParkingSpace.update(space.id, {
          available_spaces: (space.available_spaces || space.total_spaces) + 1
        });
      }

      await base44.entities.Notification.create({
        user_id: session.driver_id,
        title: "Checkout Complete",
        message: `Parking session ended. Total: ₦${totalAmount.toFixed(2)} (${totalHours}h)`,
        type: "check_out",
        link: "MyBookings"
      });

      await base44.entities.Notification.create({
        user_id: session.operator_id,
        title: "Session Completed",
        message: `${session.driver_name} checked out. You earned: ₦${operatorEarnings.toFixed(2)}`,
        type: "check_out"
      });

      navigate(createPageUrl("MyBookings"));
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to checkout. Please try again.");
      setProcessing(false);
    }
  };

  const handlePauseSession = async () => {
    if (!confirm("Pause parking session? Timer will stop until you resume.")) return;

    setProcessing(true);
    try {
      const pauseTime = new Date();
      await base44.entities.ParkingSession.update(session.id, {
        status: "paused",
        pause_time: pauseTime.toISOString()
      });

      await base44.entities.Notification.create({
        user_id: session.driver_id,
        title: "Session Paused",
        message: `Your parking session at ${session.parking_space_name} has been paused`,
        type: "pause",
        link: "MyBookings"
      });

      await base44.entities.Notification.create({
        user_id: session.operator_id,
        title: "Session Paused",
        message: `Driver ${session.driver_name} paused their session at ${session.parking_space_name}`,
        type: "pause"
      });

      navigate(createPageUrl("MyBookings"));
    } catch (err) {
      console.error("Pause error:", err);
      alert("Failed to pause session.");
      setProcessing(false);
    }
  };

  const handleResumeSession = async () => {
    if (!confirm("Resume parking session? Timer will continue from where it paused.")) return;

    setProcessing(true);
    try {
      const resumeTime = new Date();
      const pauseTime = new Date(session.pause_time);
      const pausedDuration = resumeTime - pauseTime;
      
      const totalPaused = (session.total_paused_duration || 0) + pausedDuration;

      await base44.entities.ParkingSession.update(session.id, {
        status: "active",
        resume_time: resumeTime.toISOString(),
        total_paused_duration: totalPaused
      });

      await base44.entities.Notification.create({
        user_id: session.driver_id,
        title: "Session Resumed",
        message: `Your parking session at ${session.parking_space_name} has been resumed`,
        type: "resume",
        link: "ActiveSession"
      });

      await base44.entities.Notification.create({
        user_id: session.operator_id,
        title: "Session Resumed",
        message: `Driver ${session.driver_name} resumed their session at ${session.parking_space_name}`,
        type: "resume"
      });

      await loadSession();
      setProcessing(false);
    } catch (err) {
      console.error("Resume error:", err);
      alert("Failed to resume session.");
      setProcessing(false);
    }
  };

  const handleCancelSession = async () => {
    const checkInTime = new Date(session.check_in_time);
    const now = new Date();
    const minutesElapsed = (now - checkInTime) / (1000 * 60);

    if (minutesElapsed > 5) {
      alert("Cannot cancel after 5 minutes. Please checkout instead to pay for time used.");
      return;
    }

    if (!confirm("Cancel this parking session? No charges will be applied.")) return;

    setProcessing(true);
    try {
      await base44.entities.ParkingSession.update(session.id, {
        status: "cancelled",
        check_out_time: new Date().toISOString()
      });

      const spaces = await base44.entities.ParkingSpace.filter({ id: session.parking_space_id });
      if (spaces.length > 0) {
        const space = spaces[0];
        await base44.entities.ParkingSpace.update(space.id, {
          available_spaces: (space.available_spaces || 0) + 1
        });
      }

      await base44.entities.Notification.create({
        user_id: session.driver_id,
        title: "Session Cancelled",
        message: `Your parking session at ${session.parking_space_name} was cancelled (no charge)`,
        type: "alert"
      });

      await base44.entities.Notification.create({
        user_id: session.operator_id,
        title: "Session Cancelled",
        message: `Driver ${session.driver_name} cancelled their session at ${session.parking_space_name}`,
        type: "alert"
      });

      navigate(createPageUrl("DriverDashboard"));
    } catch (err) {
      console.error("Error cancelling session:", err);
      alert("Failed to cancel session. Please try again.");
      setProcessing(false);
    }
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

  if (session.status === "paused") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="bg-purple-100 text-purple-700 mb-4 text-lg px-6 py-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-2" />
              Session Paused
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">Parking Session Paused</h1>
            <p className="text-gray-600 mt-2">Resume when you're ready to continue</p>
          </div>

          <Card className="shadow-2xl mb-6 border-2 border-purple-300">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <p className="text-5xl font-mono font-bold text-gray-400 mb-2">⏸️ PAUSED</p>
                <p className="text-gray-600">Timer stopped at {format(new Date(session.pause_time), "h:mm a")}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Location</h3>
                  <p className="font-medium text-lg mb-1">{session.parking_space_name}</p>
                  <p className="text-sm text-gray-600">{session.parking_space_address}</p>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Check-in: {format(new Date(session.check_in_time), "MMM d, h:mm a")}</p>
                    <p className="mt-1">Vehicle: {session.vehicle_plate}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Session Info</h3>
                  <p className="text-sm text-gray-600 mb-1">Booking Code</p>
                  <p className="font-mono font-semibold text-purple-700 mb-3">{session.booking_code}</p>
                  <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                  <p className="font-semibold">₦{session.hourly_rate}/hour</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-purple-800">
                  ⏸️ Your session is paused. Resume to continue parking and restart the timer.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleResumeSession}
                  disabled={processing}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {processing ? "Resuming..." : "Resume Session"}
                </Button>
                <Button
                  onClick={handleCancelSession}
                  disabled={processing || !canCancel}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {processing ? "Cancelling..." : canCancel ? "Cancel" : "Cannot Cancel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="bg-emerald-100 text-emerald-700 mb-4 text-lg px-6 py-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse mr-2" />
            Active Parking Session
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900">Parking in Progress</h1>
          <p className="text-gray-600 mt-2">Timer: {String(elapsedTime.hours).padStart(2, '0')}h {String(elapsedTime.minutes).padStart(2, '0')}m</p>
        </div>

        {!canCancel && (
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">Cancellation window closed</p>
              <p className="text-sm text-yellow-700">After 5 minutes, you must checkout to end your session (payment required)</p>
            </div>
          </div>
        )}

        <Card className="shadow-2xl mb-6 border-2 border-emerald-300">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <p className="text-6xl md:text-7xl font-mono font-bold text-gray-900 mb-2">
                {String(elapsedTime.hours).padStart(2, '0')}:{String(elapsedTime.minutes).padStart(2, '0')}:{String(elapsedTime.seconds).padStart(2, '0')}
              </p>
              <p className="text-gray-600 text-lg">Time Elapsed</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Location</h3>
                <p className="font-medium text-lg mb-1">{session.parking_space_name}</p>
                <p className="text-sm text-gray-600">{session.parking_space_address}</p>
                <div className="mt-3 text-sm text-gray-600">
                  <p>Check-in: {format(new Date(session.check_in_time), "MMM d, yyyy h:mm a")}</p>
                  <p className="mt-1">Vehicle: {session.vehicle_plate}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Billing Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-semibold">₦{session.hourly_rate}/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billable Hours</span>
                    <span className="font-semibold">{billingHours} hour(s)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-yellow-50 rounded-lg border-2 border-emerald-300 mt-3">
                    <span className="font-semibold">You Pay</span>
                    <span className="font-bold text-2xl text-emerald-600">
                      ₦{estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {session.booking_code && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-1">Booking Code</p>
                <p className="font-mono font-bold text-lg">{session.booking_code}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={handleCheckout}
                disabled={processing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {processing ? "Processing..." : "Checkout"}
              </Button>
              <Button
                onClick={handlePauseSession}
                disabled={processing}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                {processing ? "Pausing..." : "Pause"}
              </Button>
              <Button
                onClick={handleCancelSession}
                disabled={processing || !canCancel}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                {processing ? "Cancelling..." : canCancel ? "Cancel" : "Cannot Cancel"}
              </Button>
            </div>

            {canCancel && (
              <p className="text-xs text-gray-500 text-center mt-3">
                ℹ️ Free cancellation available within 5 minutes of check-in
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}