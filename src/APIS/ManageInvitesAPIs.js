// JavaScript Example: Reading Entities
// Filterable fields: operator_id, operator_name, email, parking_space_ids, status, invite_code, expires_at, accepted_at
async function fetchManagerInviteEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/ManagerInvite`, {
        headers: {
            'api_key': '578c96a4eff046bbae812d9830c4064c', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: operator_id, operator_name, email, parking_space_ids, status, invite_code, expires_at, accepted_at
async function updateManagerInviteEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/ManagerInvite/${entityId}`, {
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