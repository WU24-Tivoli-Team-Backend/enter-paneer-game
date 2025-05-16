# Enter Paneer Game Documentation

## API Routes (`src/api`)

### `src/app/api/amusements/lookup/route.ts`

This API route acts as a proxy to the backend for looking up amusement IDs by name:

- **HTTP Method**: GET
- **Purpose**: Find amusement ID by name
- **Authentication**: Uses API key from environment variables
- **Request Parameters**: `name` - The name of the amusement to find
- **Process Flow**:
  1. Extracts amusement name from query parameters
  2. Validates API key from environment variables
  3. Forwards the request to the Laravel backend API
  4. Returns amusement details including ID to the frontend

### `src/app/api/transactions/route.ts`

This API route acts as a proxy between the frontend and the backend Laravel API for processing transactions. It has the following functions:

- **HTTP Method**: POST
- **Purpose**: Creates transactions for game payments, rewards, and stamps
- **Authentication**: Requires JWT token in the Authorization header
- **Request Body**: JSON object containing transaction details with dynamically fetched amusement ID
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

### Authentication Flow

When a player uses the game:
1. The parent application embeds the game and sends JWT via postMessage
2. The JWT is captured by the JwtDisplay component
3. This token is used for all subsequent API calls
4. Each API call includes the JWT in the Authorization header

## Components (`src/components`)

### Game Initialization

#### `GameContext.tsx`
This component manages game state and initialization:
- Stores all game state variables
- Includes amusement ID lookup at startup
- Handles loading and error states for amusement lookup
- Makes the amusement ID available to other components

### Transaction Flow Components

#### `JwtDisplay.tsx`
This component manages JWT authentication:
- Listens for JWT tokens sent via postMessage from parent window
- Decodes and displays JWT information for transparency
- Stores the JWT in GameContext for use in transactions
- Provides feedback on authentication status

#### `PaymentSection.tsx`
Handles the initial game payment:
- Uses `processPayment` from `paymentService.ts`
- Shows loading state while amusement ID is being fetched
- Shows error state if amusement ID lookup fails
- Sends a stake transaction to the backend with:
  - `amusement_id` from dynamic lookup
  - `stake_amount` equal to the game's cost
- Shows loading state during payment processing
- Displays errors if payment fails
- Updates game state when payment is successful

#### `WinnerScreen.tsx` & `WinnerRewards.tsx`
Manages reward transactions after winning:
- Displays win state and reward options
- Supports two types of rewards:
  1. **Cash Reward**: Creates a payout transaction with:
     - `amusement_id` from dynamic lookup
     - `payout_amount` (typically 2€)
  2. **Stamp Reward**: Creates a payout transaction with:
     - `amusement_id` from dynamic lookup
     - `payout_amount` (minimal amount, e.g., 0.1€)
     - `stamp_id` from game configuration
- Shows success or error messages after reward processing

### Game State Management

#### `GameContext.tsx`
Central state management for the game:
- Maintains game state (input, attempts, win state)
- Stores authentication token
- Handles amusement ID lookup and storage
- Tracks payment and processing states
- Provides methods for updating game state
- Manages encouragement messages

#### Core Game Flow Components

- `Game.tsx`: Main component orchestrating the game flow
- `PaneerInput.tsx`: Handles user input and winning condition
- `EncouragementBubble.tsx`: Displays feedback on incorrect guesses

## Services (`src/services`)

### `amusementService.ts`
Handles looking up amusement IDs by name:
- **`lookupAmusementByName`**: Fetches amusement ID by name
  - Takes amusement name string as input
  - Makes API call to `/api/amusements/lookup`
  - Returns amusement details including ID
  - Handles errors and edge cases

### `paymentService.ts`
Manages payment processing for the game:
- **`processPayment`**: Creates a transaction for game payment
  - Takes JWT token and amusement ID as input
  - Builds transaction payload with amusement_id and stake_amount
  - Makes API call to `/api/transactions`
  - Returns success/error information to component

### `rewardService.ts`
Handles player rewards after winning:
- **`processReward`**: Creates transactions for rewards
  - Takes JWT token, reward type, and amusement ID as input
  - Builds appropriate transaction payload based on reward type
  - Cash rewards use only payout_amount
  - Stamp rewards use payout_amount and stamp_id
  - Makes API call to `/api/transactions`
  - Returns transaction results and reward details

### Transaction Payload Structure

For all transactions, the basic structure is:
```typescript
{
  amusement_id: number;  // Game identifier from dynamic lookup
  stake_amount?: number; // For paying to play
  payout_amount?: number; // For rewards
  stamp_id?: number;     // For stamp rewards
}
```

## Configuration

### `gameConfig.ts`
Central configuration for game parameters:
- `AMUSEMENT_NAME`: Name of the game used for ID lookup
- `AMUSEMENT_ID`: Populated dynamically at runtime
- `GROUP_ID`: Identifies the game provider group
- `COST`: Cost to play the game
- `CURRENCY`: Currency for transactions
- `STAMP_ID`: ID of the stamp to award
