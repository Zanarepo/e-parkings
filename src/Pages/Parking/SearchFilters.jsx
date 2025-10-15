import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function SearchFilters({ onFilterChange }) {
  const [maxPrice, setMaxPrice] = React.useState([1000]);
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);

  const amenities = [
    "CCTV",
    "Security Guard",
    "Covered",
    "EV Charging",
    "Car Wash",
    "24/7 Access",
    "Well Lit"
  ];

  const handleAmenityToggle = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updated);
    onFilterChange({ amenities: updated, maxPrice: maxPrice[0] });
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="mb-3 block">Maximum Price per Hour</Label>
          <Slider
            value={maxPrice}
            onValueChange={(value) => {
              setMaxPrice(value);
              onFilterChange({ amenities: selectedAmenities, maxPrice: value[0] });
            }}
            max={2000}
            step={50}
            className="mb-2"
          />
          <div className="text-sm text-gray-600">Up to ₦{maxPrice[0]}</div>
        </div>

        <div>
          <Label className="mb-3 block">Amenities</Label>
          <div className="space-y-3">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Checkbox
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <label htmlFor={amenity} className="text-sm cursor-pointer">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}