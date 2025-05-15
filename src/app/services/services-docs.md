# Services Documentation

This document covers the service modules that handle data processing and API communication in the Enter Paneer game.

## `paymentService.ts`

Manages payment processing for starting the game.

### Key Functions

#### `processPayment`

```typescript
export async function processPayment(
  jwtToken: string | null
): Promise<PaymentResult>
```

**Purpose**: Creates a transaction for game payment.

**Parameters**:
- `jwtToken`: JWT authentication token received from parent application

**Return Value**: 
- `PaymentResult` object with success status, message, and error information

**Process Flow**:
1. Validates JWT token exists
2. Creates transaction payload with:
   - `amusement_id`: From game configuration
   - `stake_amount`: Cost to play the game
3. Sends POST request to `/api/transactions` endpoint
4. Processes response and returns result

**Example Usage**:
```typescript
const result = await processPayment(jwtToken);
if (result.success) {
  // Proceed to game
} else {
  // Handle payment error
}
```

**Error Handling**:
- Returns error messages from the API
- Handles network errors and unexpected responses

## `rewardService.ts`

Handles player rewards after winning the game.

### Key Functions

#### `processReward`

```typescript
export async function processReward(
  jwtToken: string | null,
  rewardType: RewardType // "cash" | "stamp"
): Promise<RewardResult>
```

**Purpose**: Creates transactions for player rewards.

**Parameters**:
- `jwtToken`: JWT authentication token
- `rewardType`: Type of reward to process ("cash" or "stamp")

**Return Value**:
- `RewardResult` object with success status, message, and error information

**Process Flow**:
1. Validates JWT token exists
2. Creates transaction payload based on reward type:
   - Cash reward:
     ```typescript
     {
       amusement_id: GAME_CONFIG.AMUSEMENT_ID,
       payout_amount: 2.0 // 2€ cash reward
     }
     ```
   - Stamp reward:
     ```typescript
     {
       amusement_id: GAME_CONFIG.AMUSEMENT_ID,
       payout_amount: 0.1, // Minimal payout for stamp rewards
       stamp_id: GAME_CONFIG.STAMP_ID
     }
     ```
3. Sends POST request to `/api/transactions` endpoint
4. Processes response and returns result

**Example Usage**:
```typescript
// For cash reward
const cashResult = await processReward(jwtToken, "cash");

// For stamp reward
const stampResult = await processReward(jwtToken, "stamp");
```

**Important Implementation Details**:
- Stamp rewards must include a `payout_amount` due to backend validation rules
- The stamp ID is retrieved from the game configuration
- Different success messages are returned based on reward type

## Transaction Payload Structure

For all transactions, the service modules build payloads conforming to these structures:

### Stake Transaction (Payment)
```typescript
{
  amusement_id: number;  // Game identifier from config
  stake_amount: number;  // Cost to play the game
}
```

### Payout Transaction (Cash Reward)
```typescript
{
  amusement_id: number;  // Game identifier from config
  payout_amount: number; // Amount to pay out (e.g., 2.0)
}
```

### Stamp Reward Transaction
```typescript
{
  amusement_id: number;  // Game identifier from config
  payout_amount: number; // Small amount (e.g., 0.1)
  stamp_id: number;      // ID of stamp to award
}
```

## Backend Validation Rules

The services are designed to comply with these backend validation rules:

1. Cannot have both `stake_amount` and `payout_amount` in the same transaction
2. Cannot have `stamp_id` in a transaction with `stake_amount`
3. All transactions require `amusement_id`
4. Stamp awards must include a `payout_amount` (even a minimal one)

## Error Handling Strategy

Both service modules implement consistent error handling:

1. Validate parameters before making API calls
2. Use try/catch to handle network and processing errors
3. Parse error responses from the API
4. Return structured error information to calling components
5. Log detailed errors to console for debugging

## Integration with Components

- `PaymentSection` component uses `processPayment`
- `WinnerRewards` component uses `processReward`
- Both services rely on JWT token from `GameContext`
- Services communicate with the backend through the `/api/transactions` route
