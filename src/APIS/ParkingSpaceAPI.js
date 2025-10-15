// JavaScript Example: Reading Entities
// Filterable fields: name, area, address, phone, total_spaces, available_spaces, amenities, price_per_hour, latitude, longitude, qr_code, status, operator_id, operator_name, image_url
async function fetchParkingSpaceEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/ParkingSpace`, {
        headers: {
            'api_key': '578c96a4eff046bbae812d9830c4064c', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, area, address, phone, total_spaces, available_spaces, amenities, price_per_hour, latitude, longitude, qr_code, status, operator_id, operator_name, image_url
async function updateParkingSpaceEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/ParkingSpace/${entityId}`, {
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