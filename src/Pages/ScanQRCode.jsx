
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
//import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Hash, AlertCircle, CheckCircle, Loader2, MapPin, Play } from "lucide-react";

const PLATFORM_COMMISSION_RATE = 0.15; // 15%

export default function ScanQRCode() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("manual");
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);

    const sessions = await base44.entities.ParkingSession.filter({
      driver_id: currentUser.id,
      status: "active"
    });
    if (sessions.length > 0) {
      setActiveSession(sessions[0]);
    }

    // Load parking spaces for manual booking
    const spaces = await base44.entities.ParkingSpace.filter({ status: "active" });
    setParkingSpaces(spaces);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    await processQRCode(manualCode);
  };

  const handleManualBooking = async (e) => {
    e.preventDefault();
    if (!selectedSpace) {
      setError("Please select a parking space");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const spaces = await base44.entities.ParkingSpace.filter({ id: selectedSpace });
      if (spaces.length === 0) {
        setError("Parking space not found");
        setProcessing(false);
        return;
      }

      const parkingSpace = spaces[0];

      if ((parkingSpace.available_spaces || parkingSpace.total_spaces) <= 0) {
        setError("No parking spaces available at this location.");
        setProcessing(false);
        return;
      }

      if (!user || !user.id || !user.full_name || !user.phone || !user.vehicle_plate || !user.email) {
        setError("User information is incomplete. Please update your profile (Full Name, Email, Phone, Vehicle Plate).");
        setProcessing(false);
        return;
      }

      // Get operator email
      const operators = await base44.entities.User.filter({ id: parkingSpace.operator_id });
      const operatorEmail = operators.length > 0 ? operators[0].email : null;

      const sessionData = {
        parking_space_id: parkingSpace.id,
        parking_space_name: parkingSpace.name,
        parking_space_address: parkingSpace.address,
        driver_id: user.id,
        driver_name: user.full_name,
        driver_email: user.email,
        driver_phone: user.phone,
        vehicle_plate: user.vehicle_plate,
        check_in_time: new Date().toISOString(),
        hourly_rate: parkingSpace.price_per_hour,
        status: "active",
        payment_status: "pending",
        operator_id: parkingSpace.operator_id,
        operator_email: operatorEmail
      };

      await base44.entities.ParkingSession.create(sessionData);

      await base44.entities.ParkingSpace.update(parkingSpace.id, {
        available_spaces: (parkingSpace.available_spaces || parkingSpace.total_spaces) - 1
      });

      // Send notifications
      await base44.entities.Notification.create({
        user_id: user.id,
        title: "Parking Started",
        message: `Check-in successful at ${parkingSpace.name}. Rate: ₦${parkingSpace.price_per_hour}/hour`,
        type: "check_in",
        link: "ActiveSession"
      });

      await base44.entities.Notification.create({
        user_id: parkingSpace.operator_id,
        title: "New Check-in",
        message: `${user.full_name} (${user.vehicle_plate}) checked in at ${parkingSpace.name}`,
        type: "check_in"
      });

      // Send email notifications (with error handling)
      try {
        if (user.email) {
          await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: "E-Parking: Check-in Successful",
            body: `Dear ${user.full_name},\n\nYou have successfully checked in at ${parkingSpace.name}.\n\nLocation: ${parkingSpace.address}\nRate: ₦${parkingSpace.price_per_hour}/hour\n\nTimer has started. Remember to checkout when you leave.\n\nThank you for using E-Parking Lagos!`
          });
        }
      } catch (emailError) {
        console.error("Email sending failed for driver (manual booking):", emailError);
      }

      try {
        if (operatorEmail) {
          await base44.integrations.Core.SendEmail({
            to: operatorEmail,
            subject: "E-Parking: New Check-in",
            body: `A new driver has checked in at ${parkingSpace.name}.\n\nDriver: ${user.full_name}\nVehicle: ${user.vehicle_plate}\nPhone: ${user.phone}\n\nRate: ₦${parkingSpace.price_per_hour}/hour`
          });
        }
      } catch (emailError) {
        console.error("Email sending failed for operator (manual booking):", emailError);
      }

      setSuccess(
        `✅ Parking Started!\n\n` +
        `Location: ${parkingSpace.name}\n` +
        `Rate: ₦${parkingSpace.price_per_hour}/hour\n` +
        `Timer started!`
      );
      
      setTimeout(() => {
        navigate(createPageUrl("ActiveSession"));
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setError("An error occurred. Please try again.");
      setProcessing(false);
    }
  };

  const processQRCode = async (qrCode) => {
    if (processing) return;
    
    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const spaces = await base44.entities.ParkingSpace.filter({ qr_code: qrCode });

      if (spaces.length === 0) {
        setError("Invalid QR code. Please try again or use manual booking.");
        setProcessing(false);
        return;
      }

      const parkingSpace = spaces[0];

      if (activeSession) {
        // CHECKOUT PROCESS
        if (activeSession.parking_space_id === parkingSpace.id) {
          const checkOutTime = new Date();
          const checkInTime = new Date(activeSession.check_in_time);
          
          const timeDiffMs = checkOutTime - checkInTime;
          const totalHours = Math.ceil(timeDiffMs / (1000 * 60 * 60));
          
          const totalAmount = totalHours * activeSession.hourly_rate;
          const platformCommission = totalAmount * PLATFORM_COMMISSION_RATE;
          const operatorEarnings = totalAmount - platformCommission;

          await base44.entities.ParkingSession.update(activeSession.id, {
            check_out_time: checkOutTime.toISOString(),
            total_hours: totalHours,
            total_amount: totalAmount,
            platform_commission: platformCommission,
            operator_earnings: operatorEarnings,
            status: "completed",
            payment_status: "paid"
          });

          // Increment available spaces
          await base44.entities.ParkingSpace.update(parkingSpace.id, {
            available_spaces: (parkingSpace.available_spaces || parkingSpace.total_spaces) + 1
          });

          // Send notifications
          await base44.entities.Notification.create({
            user_id: activeSession.driver_id,
            title: "Checkout Complete",
            message: `Parking session ended. Total: ₦${totalAmount.toFixed(2)} (${totalHours}h)`,
            type: "check_out",
            link: "MyBookings"
          });

          await base44.entities.Notification.create({
            user_id: parkingSpace.operator_id,
            title: "Session Completed",
            message: `${activeSession.driver_name} checked out. You earned: ₦${operatorEarnings.toFixed(2)}`,
            type: "check_out"
          });

          // Send email notifications (with error handling)
          try {
            if (activeSession.driver_email) {
              await base44.integrations.Core.SendEmail({
                to: activeSession.driver_email,
                subject: "E-Parking: Checkout Complete",
                body: `Dear ${activeSession.driver_name},\n\nYour parking session at ${parkingSpace.name} has ended.\n\nDuration: ${totalHours} hour(s)\nTotal Amount: ₦${totalAmount.toFixed(2)}\n\nThank you for using E-Parking Lagos!`
              });
            }
          } catch (emailError) {
            console.error("Email sending failed for driver (QR checkout):", emailError);
          }

          setSuccess(
            `✅ Checkout Successful!\n\n` +
            `Duration: ${totalHours} hour(s)\n` +
            `Total Amount: ₦${totalAmount.toFixed(2)}`
          );

          setTimeout(() => {
            navigate(createPageUrl("MyBookings"));
          }, 3000);
        } else {
          setError("You have an active session at another parking space. Please checkout there first.");
          setProcessing(false);
        }
      } else {
        // CHECK-IN PROCESS
        if (!user || !user.id || !user.full_name || !user.phone || !user.vehicle_plate || !user.email) {
          setError("User information is incomplete. Please update your profile (Full Name, Email, Phone, Vehicle Plate).");
          setProcessing(false);
          return;
        }

        if ((parkingSpace.available_spaces || parkingSpace.total_spaces) <= 0) {
          setError("No parking spaces available at this location.");
          setProcessing(false);
          return;
        }

        // Get operator email
        const operators = await base44.entities.User.filter({ id: parkingSpace.operator_id });
        const operatorEmail = operators.length > 0 ? operators[0].email : null;

        const sessionData = {
          parking_space_id: parkingSpace.id,
          parking_space_name: parkingSpace.name,
          parking_space_address: parkingSpace.address,
          driver_id: user.id,
          driver_name: user.full_name,
          driver_email: user.email,
          driver_phone: user.phone,
          vehicle_plate: user.vehicle_plate,
          check_in_time: new Date().toISOString(),
          hourly_rate: parkingSpace.price_per_hour,
          status: "active",
          payment_status: "pending",
          operator_id: parkingSpace.operator_id,
          operator_email: operatorEmail
        };

        await base44.entities.ParkingSession.create(sessionData);

        // Decrement available spaces
        await base44.entities.ParkingSpace.update(parkingSpace.id, {
          available_spaces: (parkingSpace.available_spaces || parkingSpace.total_spaces) - 1
        });

        // Send notifications
        await base44.entities.Notification.create({
          user_id: user.id,
          title: "Parking Started",
          message: `Check-in successful at ${parkingSpace.name}. Rate: ₦${parkingSpace.price_per_hour}/hour`,
          type: "check_in",
          link: "ActiveSession"
        });

        await base44.entities.Notification.create({
          user_id: parkingSpace.operator_id,
          title: "New Check-in",
          message: `${user.full_name} (${user.vehicle_plate}) checked in at ${parkingSpace.name}`,
          type: "check_in"
        });

        // Send email notifications (with error handling)
        try {
          if (user.email) {
            await base44.integrations.Core.SendEmail({
              to: user.email,
              subject: "E-Parking: Check-in Successful",
              body: `Dear ${user.full_name},\n\nYou have successfully checked in at ${parkingSpace.name}.\n\nLocation: ${parkingSpace.address}\nRate: ₦${parkingSpace.price_per_hour}/hour\n\nTimer has started. Remember to checkout when you leave.`
            });
          }
        } catch (emailError) {
          console.error("Email sending failed for driver (QR check-in):", emailError);
        }

        try {
          if (operatorEmail) {
            await base44.integrations.Core.SendEmail({
              to: operatorEmail,
              subject: "E-Parking: New Check-in",
              body: `A new driver has checked in at ${parkingSpace.name}.\n\nDriver: ${user.full_name}\nVehicle: ${user.vehicle_plate}\nPhone: ${user.phone}\n\nRate: ₦${parkingSpace.price_per_hour}/hour`
            });
          }
        } catch (emailError) {
          console.error("Email sending failed for operator (QR check-in):", emailError);
        }

        setSuccess(
          `✅ Check-in Successful!\n\n` +
          `Location: ${parkingSpace.name}\n` +
          `Rate: ₦${parkingSpace.price_per_hour}/hour\n` +
          `Timer started!`
        );

        setTimeout(() => {
          navigate(createPageUrl("ActiveSession"));
        }, 2000);
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError("An error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("DriverDashboard"))}
          className="mb-6"
          disabled={processing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
            <CardTitle className="text-2xl">
              {activeSession ? "🚗 Checkout" : "🅿️ Start Parking"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {activeSession
                ? "Enter code or select your location to checkout"
                : "Choose your preferred method to start parking"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-300 bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800 whitespace-pre-line font-medium">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {processing && (
              <Alert className="border-blue-300 bg-blue-50">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertDescription className="text-blue-800">
                  Processing... Please wait.
                </AlertDescription>
              </Alert>
            )}

            {!processing && !success && (
              <>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={mode === "manual" ? "default" : "outline"}
                    onClick={() => setMode("manual")}
                    className={mode === "manual" ? "flex-1 bg-emerald-600" : "flex-1"}
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    Enter Code
                  </Button>
                  {!activeSession && (
                    <Button
                      variant={mode === "booking" ? "default" : "outline"}
                      onClick={() => setMode("booking")}
                      className={mode === "booking" ? "flex-1 bg-emerald-600" : "flex-1"}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Book Spot
                    </Button>
                  )}
                </div>

                {mode === "manual" && (
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Parking Code</Label>
                      <Input
                        id="code"
                        placeholder="Enter code (e.g., EPARK-001-MEGAPLAZA)"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        required
                        className="font-mono text-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Find this code at the parking entrance sign
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-lg py-6"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : activeSession ? (
                        "Complete Checkout"
                      ) : (
                        "Start Parking"
                      )}
                    </Button>
                  </form>
                )}

                {mode === "booking" && (
                  <form onSubmit={handleManualBooking} className="space-y-4">
                    <div>
                      <Label htmlFor="space">Select Parking Location</Label>
                      <Select value={selectedSpace} onValueChange={setSelectedSpace} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a parking space" />
                        </SelectTrigger>
                        <SelectContent>
                          {parkingSpaces.map(space => (
                            <SelectItem key={space.id} value={space.id}>
                              {space.name} - {space.area} (₦{space.price_per_hour}/hr) - {space.available_spaces || space.total_spaces} spots
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Select your parking location to start the timer
                      </p>
                    </div>
                    
                    {selectedSpace && (
                      <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-lg">
                        {(() => {
                          const space = parkingSpaces.find(s => s.id === selectedSpace);
                          return space ? (
                            <div>
                              <h4 className="font-semibold text-emerald-800 mb-2">
                                📍 {space.name}
                              </h4>
                              <p className="text-sm text-emerald-700">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {space.address}
                              </p>
                              <p className="text-sm text-emerald-700 mt-1">
                                Rate: <strong>₦{space.price_per_hour}/hour</strong>
                              </p>
                              <p className="text-xs text-emerald-600 mt-2">
                                Available: {space.available_spaces || space.total_spaces} spots
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={processing || !selectedSpace}
                      className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600 text-lg py-6"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Start Parking Timer
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {activeSession && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">📍 Current Session</h4>
                    <p className="text-sm text-yellow-700">
                      <strong>{activeSession.parking_space_name}</strong>
                      <br />
                      Rate: ₦{activeSession.hourly_rate}/hour
                      <br />
                      <span className="text-xs">Enter code or book manually to checkout</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {!activeSession && (
          <Card className="mt-6 bg-gradient-to-r from-emerald-50 to-yellow-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">💡 Two Ways to Park</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>1. Enter Code:</strong> Manually type the parking code found at the entrance.</p>
                <p><strong>2. Book Spot:</strong> Select your location and start timer manually.</p>
                <p className="text-xs text-gray-600 mt-3">Both methods track time and calculate fees automatically (15% platform fee included).</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
