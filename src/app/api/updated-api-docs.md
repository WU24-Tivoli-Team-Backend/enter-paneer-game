# API Routes Documentation

## `src/app/api/transactions/route.ts`

This API route acts as a proxy between the frontend and the backend Laravel API for processing transactions.

### Endpoint Details

- **HTTP Method**: POST
- **URL**: `/api/transactions`
- **Purpose**: Creates transactions for game payments, rewards, and stamps
- **Authentication**: Requires JWT token in the Authorization header

### Request Format

```javascript
{
  amusement_id: number;  // Game identifier from dynamic lookup
  stake_amount?: number; // For paying to play (optional)
  payout_amount?: number; // For rewards (optional)
  stamp_id?: number;     // For stamp rewards (optional)
}
```

### Process Flow

1. Extracts JWT token from Authorization header
2. Validates the API key from environment variables
3. Forwards the transaction payload to the Laravel backend API
4. Handles response parsing and error states
5. Returns transaction results to the frontend

### Transaction Types Supported

1. **Game Payment (Stake)**
   - Player pays to play the game
   - Uses `stake_amount` parameter
   - No `stamp_id` allowed in stake transactions

2. **Cash Reward (Payout)**
   - Gives a cash payout to the player
   - Uses `payout_amount` parameter

3. **Stamp Reward (Payout with Stamp)**
   - Issues a collectible stamp with a minimal payout amount
   - Uses both `payout_amount` and `stamp_id` parameters

### Response Format

Success:
```javascript
{
  success: true,
  message: "Transaction created",
  transaction: {
    id: number,
    // Other transaction details
  }
}
```

Error:
```javascript
{
  error: "Error message",
  details: {} // Optional additional error information
}
```

## `src/app/api/amusements/lookup/route.ts`

This API route looks up an amusement ID by name from the backend.

### Endpoint Details

- **HTTP Method**: GET
- **URL**: `/api/amusements/lookup?name=AmusementName`
- **Purpose**: Retrieves the amusement ID for a given amusement name
- **Authentication**: Uses API key from server environment

### Process Flow

1. Gets the 'name' query parameter from the request
2. Validates the API key from environment variables
3. Makes a request to the backend API's `/amusements/find-by-name` endpoint
4. Handles response parsing and error states
5. Returns the amusement details to the frontend

### Response Format

Success:
```javascript
{
  id: number,       // The amusement ID
  name: string,     // The amusement name
  group_id: number  // The group that owns the amusement
}
```

Error:
```javascript
{
  error: "Error message"
}
```

### Example Usage

```javascript
// From frontend service
const response = await fetch(`/api/amusements/lookup?name=Enter%20Paneer%20Game`);
const data = await response.json();
// data = { id: 11, name: "Enter Paneer Game", group_id: 8 }
```

## `src/app/api/rewards/route.ts`

This API route is similar to the transactions route but specifically for processing rewards.

### Endpoint Details

- **HTTP Method**: POST
- **URL**: `/api/rewards`
- **Purpose**: Creates reward transactions specifically
- **Authentication**: Requires JWT token in the Authorization header

## Authentication Flow

When a player uses the game:
1. The parent application embeds the game and sends JWT via postMessage
2. The JWT is captured by the JwtDisplay component
3. This token is stored in GameContext and used for all subsequent API calls
4. The application fetches the amusement ID by name when initializing
5. Once the amusement ID is available, it's used for all transaction calls
