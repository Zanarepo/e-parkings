export class ParkingSpace {
  constructor({
    id,
    name,
    area,
    address,
    phone,
    total_spaces,
    available_spaces = 0,
    amenities = [],
    price_per_hour,
    latitude,
    longitude,
    qr_code,
    status = "active",
    operator_id,
    operator_name,
    image_url
  }) {
    this.id = id;
    this.name = name;
    this.area = area;
    this.address = address;
    this.phone = phone;
    this.total_spaces = total_spaces;
    this.available_spaces = available_spaces;
    this.amenities = amenities;
    this.price_per_hour = price_per_hour;
    this.latitude = latitude;
    this.longitude = longitude;
    this.qr_code = qr_code;
    this.status = status;
    this.operator_id = operator_id;
    this.operator_name = operator_name;
    this.image_url = image_url;
  }

  // ✅ Compute occupancy percentage
  get occupancyRate() {
    if (!this.total_spaces) return 0;
    return ((this.total_spaces - this.available_spaces) / this.total_spaces) * 100;
  }

  // ✅ Check if a parking space is full
  get isFull() {
    return this.available_spaces <= 0;
  }

  // ✅ Check if a parking space is active
  get isActive() {
    return this.status === "active";
  }

  // ✅ Format price per hour for display
  get formattedPrice() {
    return `₦${this.price_per_hour?.toLocaleString() || 0}/hour`;
  }

  // ✅ Get amenities as a readable string
  get amenitiesList() {
    return this.amenities.length ? this.amenities.join(", ") : "No amenities listed";
  }

  // ✅ Create a new ParkingSpace from a plain object (useful when loading from Supabase)
  static fromObject(obj) {
    return new ParkingSpace({
      id: obj.id,
      name: obj.name,
      area: obj.area,
      address: obj.address,
      phone: obj.phone,
      total_spaces: obj.total_spaces,
      available_spaces: obj.available_spaces,
      amenities: obj.amenities || [],
      price_per_hour: obj.price_per_hour,
      latitude: obj.latitude,
      longitude: obj.longitude,
      qr_code: obj.qr_code,
      status: obj.status,
      operator_id: obj.operator_id,
      operator_name: obj.operator_name,
      image_url: obj.image_url
    });
  }
}
