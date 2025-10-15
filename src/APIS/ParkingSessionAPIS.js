// JavaScript Example: Reading Entities
// Filterable fields: parking_space_id, parking_space_name, parking_space_address, driver_id, driver_name, driver_email, driver_phone, vehicle_plate, check_in_time, check_out_time, pause_time, resume_time, total_paused_duration, total_hours, hourly_rate, total_amount, discount_percentage, discount_amount, final_amount, platform_commission, operator_earnings, status, payment_status, payment_method, operator_id, operator_email, booking_code, reserved_at, distance_km
async function fetchParkingSessionEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/ParkingSession`, {
        headers: {
            'api_key': '578c96a4eff046bbae812d9830c4064c', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: parking_space_id, parking_space_name, parking_space_address, driver_id, driver_name, driver_email, driver_phone, vehicle_plate, check_in_time, check_out_time, pause_time, resume_time, total_paused_duration, total_hours, hourly_rate, total_amount, discount_percentage, discount_amount, final_amount, platform_commission, operator_earnings, status, payment_status, payment_method, operator_id, operator_email, booking_code, reserved_at, distance_km
async function updateParkingSessionEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/ParkingSession/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '578c96a4eff046bbae812d9830c4064c', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}