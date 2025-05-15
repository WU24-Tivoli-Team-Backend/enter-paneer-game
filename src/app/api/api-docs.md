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
  amusement_id: number;  // Game identifier from config
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

### Example Usage

```javascript
// Example of a stake transaction (payment to play)
fetch("/api/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    amusement_id: 11,
    stake_amount: 2.0
  })
});

// Example of a payout with stamp
fetch("/api/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    amusement_id: 11,
    payout_amount: 0.1,
    stamp_id: 1
  })
});
```

## `src/app/api/auth/auth.ts` (Commented out)

This file appears to be a placeholder or deprecated authentication handler. Currently commented out in the codebase.

## `src/app/api/payment/route.ts` (Commented out)

This file appears to be a legacy payment handler that has been replaced by the transactions route. Currently commented out in the codebase.

## Authentication Flow

When a player uses the game:
1. The parent application embeds the game and sends JWT via postMessage
2. The JWT is captured by the JwtDisplay component
3. This token is stored in GameContext and used for all subsequent API calls
4. Each `/api/transactions` call includes the JWT in the Authorization header
