# Components Documentation

## Game Initialization Components

### `GameContext.tsx`

Central state management for the entire game:

- **Purpose**: Provides shared state, functions, and handles game initialization
- **Key States**:
  - `input`: Current user input text
  - `hasWon`: Whether the player has won
  - `attempts`: Number of game attempts
  - `hasPaid`: Whether player has paid to play
  - `jwtToken`: Authentication token
  - `amusementId`: Dynamically fetched amusement ID
  - `amusementError`: Error during amusement ID lookup
- **Initialization Logic**:
  - Uses `useEffect` to fetch amusement ID on component mount
  - Calls `lookupAmusementByName` with the configured amusement name
  - Stores the resulting ID for use in transactions
  - Handles loading and error states

```jsx
// Amusement ID lookup on mount
useEffect(() => {
  async function fetchAmusementId() {
    try {
      if (!amusementId) {
        const result = await lookupAmusementByName(GAME_CONFIG.AMUSEMENT_NAME);
        
        if (result.success && result.id) {
          setAmusementId(result.id);
          GAME_CONFIG.AMUSEMENT_ID = result.id;
        } else {
          setAmusementError(result.error || "Failed to fetch amusement ID");
        }
      }
    } catch (error) {
      setAmusementError("Error fetching amusement ID");
    }
  }

  fetchAmusementId();
}, [amusementId]);
```

### `JwtDisplay.tsx`

This component manages JWT authentication for the game:

- **Purpose**: Receives, decodes, and displays JWT token information
- **Key Features**:
  - Listens for `JWT_TOKEN` messages from parent window
  - Decodes and displays token information
  - Stores token in GameContext for API calls
- **Integration with Game Initialization**:
  - JWT must be available before transactions can be processed
  - Works in parallel with amusement ID lookup

## Transaction-Related Components

### `PaymentSection.tsx`

Handles the initial game payment transaction:

- **Purpose**: Processes payment to start the game
- **Key Features**:
  - Displays payment button with game cost
  - Shows loading state if amusement ID is not yet available
  - Shows error state if amusement ID lookup failed
  - Uses dynamically fetched amusement ID for transactions
- **Transaction Process**:
  1. User clicks payment button
  2. Component calls `processPayment` with JWT token and amusement ID
  3. Payment service creates a stake transaction
  4. On success, game state is updated to show the input form

```jsx
// Key payment processing logic with dynamic amusement ID
const handlePayment = async () => {
  setIsProcessing(true);
  setPaymentError(null);
  try {
    const result = await processPayment(jwtToken, amusementId);
    if (result.success) {
      setHasPaid(true);
    } else {
      setPaymentError(result.error || "Payment failed");
    }
  } catch (error) {
    // Error handling...
  } finally {
    setIsProcessing(false);
  }
};
```

### `WinnerRewards.tsx`

Manages reward transactions after winning the game:

- **Purpose**: Allows player to choose between cash or stamp reward
- **Key Features**:
  - Presents two reward options (cash and stamp)
  - Uses dynamically fetched amusement ID for transactions
  - Shows error message if amusement ID is unavailable
  - Shows processing states and feedback
- **Transaction Process**:
  1. Player selects reward type (cash or stamp)
  2. Component calls `processReward` with JWT token, reward type, and amusement ID
  3. Reward service creates appropriate transaction payload
  4. Component displays success or error message

```jsx
// Cash reward transaction flow with dynamic amusement ID
const handleCashReward = async () => {
  setIsProcessing(true);
  setError(null);
  
  try {
    const result = await processReward(jwtToken, "cash", amusementId);
    
    if (result.success) {
      setSuccessMessage(`You received a 2€ reward!`);
      onRewardClaimed();
    } else {
      setError(result.error || "Failed to process cash reward");
    }
  } catch (error) {
    // Error handling...
  } finally {
    setIsProcessing(false);
  }
};
```

## Game Flow Components

### `Game.tsx`

Main component orchestrating the game flow:

- **Purpose**: Coordinates the overall game state and UI
- **Key Features**:
  - Wraps all game functionality in GameProvider
  - Manages conditional rendering based on game state
  - Triggers amusement ID lookup at startup through GameContext

```jsx
// Game flow management
return (
  <div className="...">
    <h1>TYPE PANEER TO WIN</h1>
    <JwtDisplay />
    {!hasPaid ? (
      <PaymentSection />
    ) : !hasWon ? (
      <PaneerInput />
    ) : (
      <WinnerScreen />
    )}
  </div>
);
```

### `PaneerInput.tsx`

Handles user input and winning condition:

- **Purpose**: Provides input form and validates winning condition
- **Key Features**:
  - Accepts and validates user input
  - Tracks attempts
  - Determines win condition

### `WinnerScreen.tsx`

Displays the winner state and integrates reward options:

- **Purpose**: Shows win confirmation and provides rewards interface
- **Key Features**:
  - Displays congratulatory message with attempt count
  - Embeds WinnerRewards component (with dynamic amusement ID support)
  - Provides game reset option

## Transaction Flow Summary

1. **Initialization**:
   - Parent window sends JWT token via postMessage
   - `JwtDisplay` captures token and stores in context
   - `GameContext` fetches amusement ID by name at startup
   - Both JWT token and amusement ID must be available for transactions

2. **Payment Flow**:
   - `PaymentSection` initiates payment using `processPayment`
   - Transaction with `amusement_id` (dynamically fetched) and `stake_amount`
   - On success, game state updates to show input form

3. **Reward Flow**:
   - Player wins by typing "paneer"
   - `WinnerScreen` shows with `WinnerRewards` component
   - Player selects reward type (cash or stamp)
   - Transaction with `amusement_id` (dynamically fetched), `payout_amount` (and optional `stamp_id`)
   - Success/error feedback is displayed
