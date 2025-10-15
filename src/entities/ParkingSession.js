export class ParkingSession {
  constructor({
    id,
    parking_space_id,
    parking_space_name,
    parking_space_address,
    driver_id,
    driver_name,
    driver_email,
    driver_phone,
    vehicle_plate,
    check_in_time,
    check_out_time,
    pause_time,
    resume_time,
    total_paused_duration = 0,
    total_hours = 0,
    hourly_rate,
    total_amount,
    discount_percentage = 0,
    discount_amount = 0,
    final_amount,
    platform_commission,
    operator_earnings,
    status = "active",
    payment_status = "pending",
    payment_method,
    operator_id,
    operator_email
  }) {
    this.id = id;
    this.parking_space_id = parking_space_id;
    this.parking_space_name = parking_space_name;
    this.parking_space_address = parking_space_address;
    this.driver_id = driver_id;
    this.driver_name = driver_name;
    this.driver_email = driver_email;
    this.driver_phone = driver_phone;
    this.vehicle_plate = vehicle_plate;
    this.check_in_time = check_in_time ? new Date(check_in_time) : null;
    this.check_out_time = check_out_time ? new Date(check_out_time) : null;
    this.pause_time = pause_time ? new Date(pause_time) : null;
    this.resume_time = resume_time ? new Date(resume_time) : null;
    this.total_paused_duration = total_paused_duration;
    this.total_hours = total_hours;
    this.hourly_rate = hourly_rate;
    this.total_amount = total_amount;
    this.discount_percentage = discount_percentage;
    this.discount_amount = discount_amount;
    this.final_amount = final_amount;
    this.platform_commission = platform_commission;
    this.operator_earnings = operator_earnings;
    this.status = status;
    this.payment_status = payment_status;
    this.payment_method = payment_method;
    this.operator_id = operator_id;
    this.operator_email = operator_email;
  }

  // ✅ Calculate duration (in hours) between check-in and check-out (minus pause)
  get durationHours() {
    if (!this.check_in_time || !this.check_out_time) return 0;
    const diff = this.check_out_time - this.check_in_time - this.total_paused_duration;
    return diff / (1000 * 60 * 60);
  }

  // ✅ Compute total amount dynamically
  get computedTotalAmount() {
    return this.durationHours * this.hourly_rate;
  }

  // ✅ Compute discount in Naira
  get computedDiscountAmount() {
    return (this.computedTotalAmount * (this.discount_percentage / 100)).toFixed(2);
  }

  // ✅ Compute final amount after discount
  get computedFinalAmount() {
    return (this.computedTotalAmount - this.computedDiscountAmount).toFixed(2);
  }

  // ✅ Check if session is active
  get isActive() {
    return this.status === "active";
  }

  // ✅ Check if session is paid
  get isPaid() {
    return this.payment_status === "paid";
  }

  // ✅ Format session duration nicely
  get formattedDuration() {
    const hours = Math.floor(this.durationHours);
    const minutes = Math.round((this.durationHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  // ✅ Convert Supabase object to class instance
  static fromObject(obj) {
    return new ParkingSession(obj);
  }
}
