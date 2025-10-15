// JavaScript Example: Reading Entities
// Filterable fields: user_id, amount, type, method, description, reference, status, balance_after, session_id
async function fetchWalletTransactionEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/WalletTransaction`, {
        headers: {
            'api_key': '578c96a4eff046bbae812d9830c4064c', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: user_id, amount, type, method, description, reference, status, balance_after, session_id
async function updateWalletTransactionEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ed344eb56fa6c1a6d3451d/entities/WalletTransaction/${entityId}`, {
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