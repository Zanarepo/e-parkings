import React, { useState, useEffect } from "react";
import { ParkingSpace } from "@/entities/ParkingSpace";
import { Booking } from "@/entities/Booking";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import ParkingCard from "../components/parking/ParkingCard";
import BookingDialog from "../components/parking/BookingDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FindParking() {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [destination, setDestination] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedArea, setSelectedArea] = useState("all");
  const [maxDistance, setMaxDistance] = useState([2]); // Default 2km radius
  const [sortBy, setSortBy] = useState("distance");
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied");
        }
      );
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    const user = await User.me();
    setCurrentUser(user);
    
    const allSpaces = await ParkingSpace.filter({ is_active: true });
    setSpaces(allSpaces);
    setIsLoading(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const searchByDestination = async () => {
    if (!destination) {
      alert("Please enter a destination");
      return;
    }

    setIsSearching(true);
    setSearchPerformed(true);

    // Filter by destination (area name or location name)
    const matchingSpaces = spaces.filter(space => {
      const searchLower = destination.toLowerCase();
      const nameMatch = space.name.toLowerCase().includes(searchLower);
      const addressMatch = space.address.toLowerCase().includes(searchLower);
      const areaMatch = space.area.toLowerCase().includes(searchLower);
      
      return nameMatch || addressMatch || areaMatch;
    });

    // If no exact matches, try to find spaces in the same area
    let filtered = matchingSpaces.length > 0 ? matchingSpaces : [];
    
    // If user has location and we found matches, calculate distances
    if (userLocation && filtered.length > 0) {
      // Use the first matching space as reference point for destination
      const referenceSpace = filtered[0];
      
      // Find all spaces within radius of the reference space
      filtered = spaces.filter(space => {
        const distance = calculateDistance(
          referenceSpace.latitude,
          referenceSpace.longitude,
          space.latitude,
          space.longitude
        );
        return distance <= maxDistance[0];
      }).map(space => ({
        ...space,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          space.latitude,
          space.longitude
        )
      }));
    } else if (filtered.length > 0) {
      // No user location, just use matching spaces
      filtered = filtered.map(space => ({
        ...space,
        distance: 0
      }));
    }

    // Apply area filter if selected
    if (selectedArea !== "all") {
      filtered = filtered.filter(space => space.area === selectedArea);
    }

    // Only show spaces with available spots
    filtered = filtered.filter(space => space.available_spaces > 0);

    // Sort by selected criteria
    filtered.sort((a, b) => {
      if (sortBy === "price") return a.price_per_hour - b.price_per_hour;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "distance") return a.distance - b.distance;
      return 0;
    });

    setFilteredSpaces(filtered);
    setIsSearching(false);
  };

  const handleBookSpace = (space) => {
    setSelectedSpace(space);
  };

  const handleConfirmBooking = async (bookingData) => {
    const bookingCode = `EPK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    await Booking.create({
      ...bookingData,
      parking_space_id: selectedSpace.id,
      parking_space_name: selectedSpace.name,
      parking_space_address: selectedSpace.address,
      operator_phone: selectedSpace.operator_phone,
      user_email: currentUser.email,
      user_name: currentUser.full_name,
      user_phone: currentUser.phone,
      booking_code: bookingCode,
      hourly_rate: selectedSpace.price_per_hour,
      status: "reserved",
      payment_status: "pending",
      payment_method: "card",
      payment_reference: `PAY-${Date.now()}`
    });

    await ParkingSpace.update(selectedSpace.id, {
      available_spaces: selectedSpace.available_spaces - 1
    });

    setSelectedSpace(null);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Parking Near Your Destination
          </h1>
          <p className="text-gray-600">
            Enter where you're going and we'll show parking spots within {maxDistance[0]}km radius
          </p>
        </div>

        {/* Destination Search */}
        <Card className="p-6 mb-8 shadow-lg border-none bg-white">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                <Input
                  placeholder="Where are you going? (e.g., Victoria Island, Eko Hotel, Ikeja City Mall)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchByDestination()}
                  className="pl-12 h-14 text-lg border-emerald-200 focus:border-emerald-500"
                />
              </div>
              
              <Button 
                onClick={searchByDestination}
                disabled={isSearching || !destination}
                className="h-14 px-8 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Find Parking
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="radius" className="mb-2 block text-sm font-medium">
                  Search Radius: {maxDistance[0]}km
                </Label>
                <Slider
                  id="radius"
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={5}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only show parking within {maxDistance[0]}km of your destination
                </p>
              </div>

              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="Victoria Island">Victoria Island</SelectItem>
                  <SelectItem value="Ikeja">Ikeja</SelectItem>
                  <SelectItem value="Lekki Phase 1">Lekki Phase 1</SelectItem>
                  <SelectItem value="Ikoyi">Ikoyi</SelectItem>
                  <SelectItem value="Yaba">Yaba</SelectItem>
                  <SelectItem value="Surulere">Surulere</SelectItem>
                  <SelectItem value="Maryland">Maryland</SelectItem>
                  <SelectItem value="Ajah">Ajah</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {userLocation && (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <AlertDescription className="text-emerald-800">
              <strong>Location enabled!</strong> We'll show you parking spots sorted by distance from your current location.
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {!searchPerformed ? (
          <Card className="p-12 text-center border-2 border-dashed border-emerald-200">
            <Navigation className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Find Parking?</h3>
            <p className="text-gray-600 mb-4">
              Enter your destination above and we'll show you available parking spots within {maxDistance[0]}km
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDestination("Victoria Island");
                  setTimeout(searchByDestination, 100);
                }}
              >
                Victoria Island
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDestination("Ikeja");
                  setTimeout(searchByDestination, 100);
                }}
              >
                Ikeja
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDestination("Lekki Phase 1");
                  setTimeout(searchByDestination, 100);
                }}
              >
                Lekki Phase 1
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                <strong>{filteredSpaces.length}</strong> parking spot{filteredSpaces.length !== 1 ? 's' : ''} available
                {destination && ` near "${destination}"`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse bg-gray-100" />
                ))}
              </div>
            ) : filteredSpaces.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No parking found in this area</h3>
                <p className="text-gray-600 mb-4">
                  Try expanding your search radius or searching a different location
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMaxDistance([maxDistance[0] + 1]);
                    searchByDestination();
                  }}
                >
                  Expand Search to {maxDistance[0] + 1}km
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
                  <ParkingCard
                    key={space.id}
                    space={space}
                    onBook={handleBookSpace}
                    userLocation={userLocation}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedSpace && (
        <BookingDialog
          space={selectedSpace}
          currentUser={currentUser}
          onConfirm={handleConfirmBooking}
          onClose={() => setSelectedSpace(null)}
        />
      )}
    </div>
  );
}