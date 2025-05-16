# Services Documentation

This document covers the service modules that handle data processing and API communication in the Enter Paneer game.

## `amusementService.ts`

Handles amusement ID lookup by name.

### Key Functions

#### `lookupAmusementByName`

```typescript
export async function lookupAmusementByName(
  amusementName: string
): Promise<AmusementLookupResult>
```

**Purpose**: Fetches the amusement ID by its name.

**Parameters**:
- `amusementName`: The name of the amusement to look up

**Return Value**: 
- `AmusementLookupResult` object with success status, amusement ID, and error information

**Process Flow**:
1. Makes a GET request to `/api/amusements/lookup` with amusement name as query parameter
2. Processes the response and extracts amusement details
3. Returns success with amusement ID, name, and group ID
4. Returns error information if lookup fails

**Example Usage**:
```typescript
const result = await lookupAmusementByName("Enter Paneer Game");
if (result.success && result.id) {
  // Use the amusement ID for transactions
  const amusementId = result.id;
}
```

## `paymentService.ts`

Manages payment processing for starting the game.

### Key Functions

#### `processPayment`

```typescript
export async function processPayment(
  jwtToken: string | null,
  amusementId: number | undefined
): Promise<PaymentResult>
```

**Purpose**: Creates a transaction for game payment.

**Parameters**:
- `jwtToken`: JWT authentication token received from parent application
- `amusementId`: Dynamically fetched amusement ID

**Return Value**: 
- `PaymentResult` object with success status, message, and error information

**Process Flow**:
1. Validates JWT token exists
2. Validates amusement ID is available
3. Creates transaction payload with:
   - `amusement_id`: Dynamically fetched ID
   - `stake_amount`: Cost to play the game
4. Sends POST request to `/api/transactions` endpoint
5. Processes response and returns result

**Example Usage**:
```typescript
const result = await processPayment(jwtToken, amusementId);
if (result.success) {
  // Proceed to game
} else {
  // Handle payment error
}
```

**Error Handling**:
- Returns error if JWT token is missing
- Returns error if amusement ID is unavailable
- Returns error messages from the API
- Handles network errors and unexpected responses

## `rewardService.ts`

Handles player rewards after winning the game.

### Key Functions

#### `processReward`

```typescript
export async function processReward(
  jwtToken: string | null,
  rewardType: RewardType, // "cash" | "stamp"
  amusementId: number | undefined
): Promise<RewardResult>
```

**Purpose**: Creates transactions for player rewards.

**Parameters**:
- `jwtToken`: JWT authentication token
- `rewardType`: Type of reward to process ("cash" or "stamp")
- `amusementId`: Dynamically fetched amusement ID

**Return Value**:
- `RewardResult` object with success status, message, and error information

**Process Flow**:
1. Validates JWT token exists
2. Validates amusement ID is available
3. Creates transaction payload based on reward type:
   - Cash reward:
     ```typescript
     {
       amusement_id: amusementId, // Dynamically fetched
       payout_amount: 2.0 // 2€ cash reward
     }
     ```
   - Stamp reward:
     ```typescript
     {
       amusement_id: amusementId, // Dynamically fetched
       payout_amount: 0.1, // Minimal payout for stamp rewards
       stamp_id: GAME_CONFIG.STAMP_ID
     }
     ```
4. Sends POST request to `/api/transactions` endpoint
5. Processes response and returns result

**Example Usage**:
```typescript
// For cash reward
const cashResult = await processReward(jwtToken, "cash", amusementId);

// For stamp reward
const stampResult = await processReward(jwtToken, "stamp", amusementId);
```

## Transaction Payload Structure

For all transactions, the service modules build payloads conforming to these structures:

### Stake Transaction (Payment)
```typescript
{
  amusement_id: number;  // Dynamically looked up ID
  stake_amount: number;  // Cost to play the game
}
```

### Payout Transaction (Cash Reward)
```typescript
{
  amusement_id: number;  // Dynamically looked up ID
  payout_amount: number; // Amount to pay out (e.g., 2.0)
}
```

### Stamp Reward Transaction
```typescript
{
  amusement_id: number;  // Dynamically looked up ID
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

All service modules implement consistent error handling:

1. Validate parameters before making API calls
2. Return early with appropriate errors if required parameters are missing
3. Use try/catch to handle network and processing errors
4. Parse error responses from the API
5. Return structured error information to calling components
6. Log detailed errors to console for debugging

## Integration with Components

- `GameContext` uses `lookupAmusementByName` to fetch amusement ID at startup
- `PaymentSection` component uses `processPayment` with the fetched ID
- `WinnerRewards` component uses `processReward` with the fetched ID
- All services rely on JWT token from `GameContext`
- Services communicate with the backend through the respective API routes
