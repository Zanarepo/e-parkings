import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, CreditCard, Car, MapPin, QrCode, Info, Navigation, Phone } from "lucide-react";

export default function BookingDialog({ space, currentUser, onConfirm, onClose }) {
  const [vehiclePlate, setVehiclePlate] = useState(currentUser?.vehicle_plate || "");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!vehiclePlate) {
      alert("Please enter your vehicle plate number");
      return;
    }

    setIsProcessing(true);
    
    await onConfirm({
      vehicle_plate: vehiclePlate
    });

    setIsProcessing(false);
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${space.latitude},${space.longitude}`;
    window.open(url, '_blank');
  };

  const callOwner = () => {
    if (space.operator_phone) {
      window.location.href = `tel:${space.operator_phone}`;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Reserve Your Parking Spot</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Space Details */}
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6 border border-emerald-100">
            <h3 className="font-bold text-lg mb-3 text-gray-900">{space.name}</h3>
            <div className="flex items-start gap-2 text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mt-1 text-emerald-600" />
              <span className="text-sm">{space.address}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-emerald-600 text-white">{space.area}</Badge>
              {space.distance !== undefined && space.distance > 0 && (
                <Badge variant="outline" className="border-blue-500 text-blue-700">
                  {space.distance.toFixed(1)} km away
                </Badge>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={openInMaps}
                className="flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              {space.operator_phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={callOwner}
                  className="flex-1"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Owner
                </Button>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="bg-blue-50 border-blue-200">
            <QrCode className="w-4 h-4 text-blue-700" />
            <AlertDescription className="text-blue-900">
              <strong>How it works:</strong>
              <ol className="mt-2 space-y-1 text-sm ml-4 list-decimal">
                <li>Reserve your spot now</li>
                <li>Drive to the parking location</li>
                <li>Scan QR code at entrance to CHECK IN and start timer</li>
                <li>When leaving, scan QR code again to CHECK OUT</li>
                <li>Pay only for actual time used (₦{space.price_per_hour}/hour)</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicle" className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4" />
                Vehicle Plate Number *
              </Label>
              <Input
                id="vehicle"
                placeholder="e.g., LAG-123-AB"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                className="text-lg h-12"
              />
            </div>
          </div>

          {/* Pricing Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="font-semibold text-2xl text-emerald-700">₦{space.price_per_hour}</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 mt-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-900">
                  <strong>Pay only for time used!</strong> Your final bill = Actual parking time × ₦{space.price_per_hour}/hour. 
                  Calculated automatically when you check out.
                </p>
              </div>
            </div>
          </div>

          {/* Operator Contact */}
          {space.operator_phone && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <strong>Need help finding the location?</strong>
              <br />
              Contact: {space.operator_name || "Parking Owner"} - {space.operator_phone}
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 px-8"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {isProcessing ? "Reserving..." : "Reserve Spot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}