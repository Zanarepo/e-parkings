import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Star, 
  Shield, 
  Camera, 
  Zap,
  Car,
  Clock,
  Navigation,
  Phone
} from "lucide-react";

export default function ParkingCard({ space, onBook, userLocation }) {
  const amenityIcons = {
    "CCTV": Camera,
    "Security Guard": Shield,
    "24/7 Access": Clock,
    "EV Charging": Zap,
    "Covered": Shield,
    "Well Lit": Zap
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-100">
          {space.image_url ? (
            <img 
              src={space.image_url} 
              alt={space.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-20 h-20 text-emerald-600 opacity-30" />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Badge className="bg-white/95 text-emerald-700 border-none shadow-lg font-semibold">
              {space.available_spaces} spots
            </Badge>
            {space.distance !== undefined && space.distance > 0 && (
              <Badge className="bg-blue-500 text-white border-none shadow-lg font-semibold">
                {space.distance.toFixed(1)} km away
              </Badge>
            )}
          </div>

          {space.rating && (
            <div className="absolute top-4 left-4 bg-white/95 rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-sm">{space.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
              {space.name}
            </h3>
            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-600" />
              <span className="text-sm line-clamp-2">{space.address}</span>
            </div>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
              {space.area}
            </Badge>
          </div>

          {space.amenities && space.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {space.amenities.slice(0, 3).map((amenity, index) => {
                const Icon = amenityIcons[amenity] || Shield;
                return (
                  <div key={index} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1.5">
                    <Icon className="w-3 h-3" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
              {space.amenities.length > 3 && (
                <div className="text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5">
                  +{space.amenities.length - 3} more
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={openInMaps}
              className="flex-1 text-xs"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Navigate
            </Button>
            {space.operator_phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={callOwner}
                className="flex-1 text-xs"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-emerald-700">
              ₦{space.price_per_hour}
            </div>
            <div className="text-sm text-gray-500">per hour</div>
          </div>
          
          <Button 
            onClick={() => onBook(space)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200 px-6 py-2"
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}