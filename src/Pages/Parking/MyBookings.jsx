import React, { useState, useEffect } from "react";
import { Booking } from "@/entities/Booking";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, differenceInMinutes } from "date-fns";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard,
  CheckCircle,
  XCircle,
  Car,
  QrCode,
  Navigation,
  Phone,
  PlayCircle,
  StopCircle
} from "lucide-react";
import { motion } from "framer-motion";

import QRCodeDisplay from "../components/booking/QRCodeDisplay";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    const user = await User.me();
    setCurrentUser(user);
    
    const allBookings = await Booking.filter({ user_email: user.email }, "-created_date");
    setBookings(allBookings);
    setIsLoading(false);
  };

  const activeBookings = bookings.filter(b => b.status === "reserved" || b.status === "checked_in");
  const completedBookings = bookings.filter(b => b.status === "completed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  const openInMaps = (booking) => {
    const address = encodeURIComponent(booking.parking_space_address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank');
  };

  const callOwner = (booking) => {
    if (booking.operator_phone) {
      window.location.href = `tel:${booking.operator_phone}`;
    }
  };

  const BookingCard = ({ booking }) => {
    const statusConfig = {
      reserved: { 
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: Clock,
        label: "Reserved"
      },
      checked_in: { 
        color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        icon: PlayCircle,
        label: "Checked In - Timer Running"
      },
      completed: { 
        color: "bg-gray-100 text-gray-700 border-gray-200", 
        icon: CheckCircle,
        label: "Completed"
      },
      cancelled: { 
        color: "bg-red-100 text-red-700 border-red-200", 
        icon: XCircle,
        label: "Cancelled"
      }
    };

    const config = statusConfig[booking.status];
    const StatusIcon = config.icon;

    const elapsedTime = booking.check_in_time 
      ? differenceInMinutes(new Date(), new Date(booking.check_in_time))
      : 0;

    const estimatedCost = booking.check_in_time && !booking.check_out_time
      ? (elapsedTime / 60) * booking.hourly_rate
      : booking.total_amount || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {booking.parking_space_name}
                </h3>
                <div className="flex items-start gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-600" />
                  <span className="text-sm">{booking.parking_space_address}</span>
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge className={`${config.color} border`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300">
                    <Car className="w-3 h-3 mr-1" />
                    {booking.vehicle_plate}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                    ₦{booking.hourly_rate}/hr
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timer Display for Checked In */}
            {booking.status === "checked_in" && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-emerald-700 font-medium mb-1">Parking Time</div>
                    <div className="text-3xl font-bold text-emerald-700">
                      {Math.floor(elapsedTime / 60)}h {elapsedTime % 60}m
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Current Cost</div>
                    <div className="text-2xl font-bold text-amber-700">
                      ₦{estimatedCost.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 animate-pulse" />
                  Timer started at {format(new Date(booking.check_in_time), "h:mm a")}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="grid grid-cols-1 gap-3 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Booking Code</span>
                <span className="font-mono font-bold text-emerald-700">{booking.booking_code}</span>
              </div>
              
              {booking.check_in_time && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Check-in Time</span>
                  <span className="font-semibold">{format(new Date(booking.check_in_time), "MMM d, h:mm a")}</span>
                </div>
              )}

              {booking.check_out_time && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Check-out Time</span>
                    <span className="font-semibold">{format(new Date(booking.check_out_time), "MMM d, h:mm a")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
                    <span className="text-gray-600 font-medium">Total Duration</span>
                    <span className="font-bold text-emerald-700">{booking.actual_duration_hours?.toFixed(2)} hours</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {(booking.status === "reserved" || booking.status === "checked_in") && (
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInMaps(booking)}
                  className="flex-1"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
                {booking.operator_phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => callOwner(booking)}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Owner
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setSelectedBooking(booking)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR
                </Button>
              </div>
            )}

            {/* Final Cost */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-600 font-medium">
                {booking.status === "completed" ? "Final Amount" : "Estimated Cost"}
              </span>
              <span className="text-2xl font-bold text-emerald-700">
                ₦{(booking.total_amount || estimatedCost).toFixed(2)}
              </span>
            </div>

            {booking.payment_reference && (
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {booking.payment_method}
                </span>
                <span>Ref: {booking.payment_reference}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            Track your parking reservations and scan QR codes for check-in/check-out
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-md border-none p-1">
            <TabsTrigger value="active" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : activeBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active bookings</h3>
                <p className="text-gray-600">Your active parking reservations will appear here</p>
              </Card>
            ) : (
              activeBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed bookings</h3>
                <p className="text-gray-600">Your booking history will appear here</p>
              </Card>
            ) : (
              completedBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cancelled bookings</h3>
                <p className="text-gray-600">Cancelled reservations will appear here</p>
              </Card>
            ) : (
              cancelledBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedBooking && (
        <QRCodeDisplay
          booking={selectedBooking}
          onClose={() => {
            setSelectedBooking(null);
            loadBookings();
          }}
        />
      )}
    </div>
  );
}