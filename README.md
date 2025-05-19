# Enter Paneer Game Documentation

## Overview

This is a simple Next.js game where players type "paneer" to win, involving a payment to play and rewards upon winning. The game integrates with a backend API for handling transactions.

## API Integration (`src/app/api`)

### `src/app/api/transactions/route.ts`

This API route acts as a proxy between the frontend and the backend Laravel API for processing all types of transactions:

- **HTTP Method**: POST
- **Purpose**: Creates transactions for game payments, rewards, and stamps
- **Authentication**: Requires JWT token in the Authorization header
- **Request Body**: JSON object containing transaction details
- **Process Flow**:
  1. Extracts JWT token from Authorization header
  2. Validates the API key from environment variables
  3. Forwards the transaction payload to the Laravel backend API
  4. Handles response parsing and error states
  5. Returns transaction results to the frontend

The route supports different types of transactions:

- **Game Payment**: Player paying to play the game (stake transaction)
- **Cash Reward**: Giving a cash payout to the player (payout transaction)
- **Stamp Reward**: Issuing a collectible stamp with a minimal payout amount

**Note**: Currently, the backend requires that all stamp rewards include a payout amount, and all rewards with a payout should include a stamp. This requirement will be changing in an upcoming backend update.

### Authentication Flow

When a player uses the game:

1. The parent application embeds the game and sends JWT via postMessage
2. The JWT is captured by the JwtDisplay component
3. This token is used for all subsequent API calls
4. Each `/api/transactions` call includes the JWT in the Authorization header

## Components (`src/components`)

### Transaction Flow Components

#### `JwtDisplay.tsx`

This component manages JWT authentication:

- Listens for JWT tokens sent via postMessage from parent window
- Decodes and displays JWT information for transparency
- Stores the JWT in GameContext for use in transactions
- Provides feedback on authentication status

#### `PaymentSection.tsx`

Handles the initial game payment:

- Uses `processPayment` from `transactionService.ts`
- Sends a stake transaction to the backend with:
  - `amusement_id` from game configuration
  - `stake_amount` equal to the game's cost
- Shows loading state during payment processing
- Displays errors if payment fails
- Updates game state when payment is successful

#### `WinnerScreen.tsx` & `WinnerRewards.tsx`

Manages reward transactions after winning:

- Displays win state and reward options
- Supports two types of rewards:
  1. **Cash Reward**: Creates a payout transaction with:
     - `amusement_id` from game configuration
     - `payout_amount` (typically 2€)
  2. **Stamp Reward**: Creates a payout transaction with:
     - `amusement_id` from game configuration
     - `payout_amount` (minimal amount, e.g., 0.1€)
     - `stamp_id` from game configuration
- Shows success or error messages after reward processing

### Game State Management

#### `GameContext.tsx`

Central state management for the game:

- Maintains game state (input, attempts, win state)
- Stores authentication token
- Tracks payment and processing states
- Provides methods for updating game state
- Manages encouragement messages

#### Core Game Flow Components

- `Game.tsx`: Main component orchestrating the game flow
- `PaneerInput.tsx`: Handles user input and winning condition
- `EncouragementBubble.tsx`: Displays feedback on incorrect guesses

## Services (`src/services`)

### `transactionService.ts`

Consolidated service that manages all transaction types for the game:

#### Main Functions:

- **`createTransaction`**: Generic function that creates any transaction with a custom payload

  - Takes payload and JWT token as inputs
  - Makes API call to `/api/transactions`
  - Returns success/error information

- **`processTransaction`**: Central function that handles all transaction types

  - Takes JWT token and transaction type as input
  - Builds appropriate transaction payload based on type
  - Uses createTransaction to execute the transaction
  - Returns standardized result

- **Convenience functions**:
  - `processPayment`: Creates a transaction for game payment
  - `processCashReward`: Creates a transaction for cash rewards
  - `processStampReward`: Creates a transaction for stamp rewards
  - `processReward`: Compatibility function that takes a reward type parameter

### Transaction Payload Structure

For all transactions, the basic structure is:

```typescript
{
  amusement_id: number;  // Game identifier from config
  stake_amount?: number; // For paying to play
  payout_amount?: number; // For rewards
  stamp_id?: number;     // For stamp rewards
}
```

Important backend validation rules:

- Cannot have both stake_amount and payout_amount in the same transaction
- Cannot have stamp_id in a transaction with stake_amount
- Stamp rewards must use payout_amount (even if minimal)
- **Note**: These validation rules are scheduled to change in an upcoming backend update

## Utilities (`src/utils`)

### `auth.ts`

Handles JWT authentication and verification:

- `verifyToken`: Server-side JWT verification function
- `decodeJwt`: Client-side JWT decoding function used by the JwtDisplay component

## Configuration

### `gameConfig.ts`

Central configuration for game parameters:

- `AMUSEMENT_ID`: Identifies the game in the backend
- `GROUP_ID`: Identifies the game provider group
- `COST`: Cost to play the game
- `CURRENCY`: Currency for transactions
- `STAMP_ID`: ID of the stamp to award

## Environment Setup

Create a `.env` file based on `.env.example`:

```
NODE_ENV=production
API_URL=http://localhost:8000
API_KEY=key
#for testing: look at what ID your game has
AMUSEMENT_ID=11
#make sure that it has the correct corresponding stamp
STAMP_ID=1
```

## Future Changes

The current backend requires:

1. All stamp rewards must include a payout amount
2. All rewards with payouts should include a stamp

**Note**: These requirements will be changing in an upcoming backend update to make these relationships more flexible. When the backend is updated, the `transactionService.ts` file will need to be modified to accommodate these changes.

## Getting Started

1. Install dependencies: `npm install` or `yarn`
2. Set up the environment file: copy `.env.example` to `.env` and update values
3. Run the development server: `npm run dev` or `yarn dev`
4. Open [http://localhost:3001](http://localhost:3001) to view the game

## Development Process

When making changes to the codebase:

1. Follow the existing component structure
2. Use the centralized transaction service for all API interactions
3. Maintain the JWT authentication flow
4. Update configuration as needed in `gameConfig.ts`
5. Test all transaction types: payment, cash reward, and stamp reward
