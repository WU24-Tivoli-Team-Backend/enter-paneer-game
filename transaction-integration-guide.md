# Enter Paneer Game - Transaction Integration Guide

This guide documents how the Enter Paneer Game handles transactions with the Tivoli backend API. It provides key information on how to implement payment and reward transactions in your own games.

## Overview

The game uses three main transaction types:
1. **Payment** (stake): Player pays to play the game
2. **Cash Reward** (payout): Player receives cash for winning 
3. **Stamp Reward** (payout + stamp): Player receives a collectible stamp for winning

All transactions require a valid JWT token from the parent application.

## Core Transaction Files

- `src/app/services/transactionService.ts`: Main service for handling transactions
- `src/app/api/transactions/route.ts`: API route that proxies requests to the backend
- `src/app/utils/gameTransactions.ts`: Helper functions for specific transaction types
- `src/app/config/gameConfig.ts`: Configuration for game parameters

## Transaction Types

### 1. Payment Transaction (Stake)

**Purpose**: Charge the player to play the game

**Payload**:
```typescript
{
  amusement_id: number,  // ID of your game
  stake_amount: number   // Cost to play (e.g., 2.0)
}
```

**Implementation**:
```typescript
// Using processPayment
import { processPayment } from "../services/transactionService";

async function handlePayment() {
  const result = await processPayment(jwtToken);
  
  if (result.success) {
    // Payment successful - Allow player to play
    setHasPaid(true);
  } else {
    // Payment failed - Show error
    setPaymentError(result.error);
  }
}
```

### 2. Cash Reward Transaction (Payout)

**Purpose**: Award cash to player for winning

**Payload**:
```typescript
{
  amusement_id: number,   // ID of your game
  payout_amount: number   // Amount to pay (e.g., 2.0)
}
```

**Implementation**:
```typescript
// Using processReward
import { processReward } from "../services/transactionService";

async function handleCashReward() {
  const result = await processReward(jwtToken, "cash");
  
  if (result.success) {
    // Reward successful - Show success message
    setSuccessMessage(`You received a €2 reward!`);
  } else {
    // Reward failed - Show error
    setError(result.error);
  }
}
```

### 3. Stamp Reward Transaction (Payout + Stamp)

**Purpose**: Award a collectible stamp to player for winning

**Payload**:
```typescript
{
  amusement_id: number,   // ID of your game
  payout_amount: number,  // Minimal payout (e.g., 0.1)
  stamp_id: number        // ID of stamp to award
}
```

**Implementation**:
```typescript
// Using processReward
import { processReward } from "../services/transactionService";

async function handleStampReward() {
  const result = await processReward(jwtToken, "stamp");
  
  if (result.success) {
    // Reward successful - Show success message
    setSuccessMessage(`You received a new stamp for your collection!`);
  } else {
    // Reward failed - Show error
    setError(result.error);
  }
}
```

## Important Backend Validation Rules

1. Cannot have both `stake_amount` and `payout_amount` in the same transaction
2. Cannot have `stamp_id` in a transaction with `stake_amount`
3. Stamp rewards must include a `payout_amount` (even if minimal)

## JWT Token Handling

The token is received via postMessage from the parent window:

```typescript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'JWT_TOKEN') {
    const { token } = event.data;
    setJwtToken(token);
  }
});
```

Send a ready message to the parent:

```typescript
if (window.parent !== window) {
  window.parent.postMessage({ type: 'GAME_READY' }, '*');
}
```

## Configuring Your Game

Update `src/app/config/gameConfig.ts` with your game's specific values:

```typescript
export const GAME_CONFIG: GameConfig = {
  AMUSEMENT_ID: 11,  // Your assigned amusement ID
  GROUP_ID: 8,       // Your group ID
  COST: 2.0,         // Cost to play your game
  CURRENCY: "EUR",
  STAMP_ID: 1,       // ID of stamp to award
};
```

## API Environment Configuration

Create a `.env.local` file with:

```
# URL of the backend API
API_URL=http://localhost:8000

# Your API Key for accessing the backend
API_KEY=your_group_api_key
```

## Testing Transactions

1. **Payment Flow**: 
   - Receive JWT token
   - Player clicks payment button
   - Call `processPayment` with token
   - Handle success/error response

2. **Reward Flow**:
   - Player wins the game
   - Player selects reward type (cash or stamp)
   - Call `processReward` with token and reward type
   - Handle success/error response

## Error Handling

Always check the `success` flag in transaction responses:

```typescript
const result = await processPayment(jwtToken);

if (result.success) {
  // Handle success
} else {
  // Handle error: result.error contains the error message
}
```

## Debugging Tips

- Check the browser console for detailed transaction logs
- Look for response status codes and error messages
- Ensure your JWT token is valid and not expired
- Verify your game's AMUSEMENT_ID and STAMP_ID match the backend's values
