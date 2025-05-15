# Components Documentation

## Transaction-Related Components

### `JwtDisplay.tsx`

This component manages JWT authentication for the game:

- **Purpose**: Receives, decodes, and displays JWT token information
- **Key Features**:
  - Listens for `JWT_TOKEN` messages from parent window
  - Decodes and displays token information
  - Stores token in GameContext for API calls
  - Displays different states (waiting, error, authenticated)
- **Internal Flow**:
  1. Sets up event listener for `message` event
  2. When JWT token is received, decodes and validates it
  3. Stores token in game context
  4. Notifies parent window when game is ready

```jsx
// Example of how JwtDisplay processes tokens
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === "JWT_TOKEN") {
      const { token } = event.data;
      setJwtToken(token);
      // Decode and process token...
    }
  };
  window.addEventListener("message", handleMessage);
  // Send ready message to parent
  window.parent.postMessage({ type: "GAME_READY" }, "*");
  // Cleanup
  return () => window.removeEventListener("message", handleMessage);
}, [setJwtToken]);
```

### `PaymentSection.tsx`

Handles the initial game payment transaction:

- **Purpose**: Processes payment to start the game
- **Key Features**:
  - Displays payment button with game cost
  - Shows processing state during transaction
  - Handles and displays payment errors
  - Updates game state on successful payment
- **Transaction Process**:
  1. User clicks payment button
  2. Component calls `processPayment` service with JWT token
  3. Payment service creates a stake transaction
  4. On success, game state is updated to show the input form

```jsx
// Key payment processing logic
const handlePayment = async () => {
  setIsProcessing(true);
  setPaymentError(null);
  try {
    const result = await processPayment(jwtToken);
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
  - Processes reward transactions
  - Shows processing states and feedback
  - Prevents claiming multiple rewards
- **Transaction Process**:
  1. Player selects reward type (cash or stamp)
  2. Component calls `processReward` service with JWT token and reward type
  3. Reward service creates appropriate transaction payload
  4. Component displays success or error message

```jsx
// Cash reward transaction flow
const handleCashReward = async () => {
  setIsProcessing(true);
  setError(null);
  
  try {
    const result = await processReward(jwtToken, "cash");
    
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

// Stamp reward transaction flow
const handleStampReward = async () => {
  // Similar process but with "stamp" reward type
  // ...
};
```

### `WinnerScreen.tsx`

Displays the winner state and integrates reward options:

- **Purpose**: Shows win confirmation and provides rewards interface
- **Key Features**:
  - Displays congratulatory message with attempt count
  - Embeds WinnerRewards component
  - Provides game reset option
- **Integration with Rewards**:
  - Manages reward claimed state
  - Controls display of reward options
  - Provides reset functionality

```jsx
// Integration of rewards component
return (
  <div className="flex flex-col items-center w-full animate-[popIn_0.5s_ease-out]">
    {/* Win message display */}
    <div className="bg-[#fef8ee] border-2 border-[#f0e0c9] rounded-2xl p-8 w-full">
      <h2 className="text-3xl mb-6 text-center">
        Congratulations! You typed paneer after {attempts} {attempts === 1 ? "attempt" : "attempts"}!
      </h2>
      {/* Additional content */}
    </div>
    
    {/* Conditional rendering of rewards */}
    {!rewardClaimed && <WinnerRewards onRewardClaimed={handleRewardClaimed} />}
    
    {/* Reset game button */}
    <button onClick={resetGame}>
      {rewardClaimed ? "Play Again" : "No reward, just play again"}
    </button>
  </div>
);
```

## Game State Management

### `GameContext.tsx`

Central state management for the entire game:

- **Purpose**: Provides shared state and functions for all game components
- **Key States**:
  - `input`: Current user input text
  - `hasWon`: Whether the player has won
  - `attempts`: Number of game attempts
  - `hasPaid`: Whether player has paid to play
  - `jwtToken`: Authentication token
  - `isProcessing`: Loading state for async operations
- **Methods**:
  - `setInput`: Updates input text
  - `setHasWon`: Updates win state
  - `setHasPaid`: Updates payment state
  - `setJwtToken`: Sets authentication token
  - `resetGame`: Resets all game state
- **Important for Transactions**:
  - Stores JWT token for API calls
  - Tracks payment status
  - Manages processing states

## Game Flow Components

### `Game.tsx`

Main component orchestrating the game flow:

- **Purpose**: Coordinates the overall game state and UI
- **Key Features**:
  - Wraps all game functionality in GameProvider
  - Manages conditional rendering based on game state
  - Handles component transitions (payment → gameplay → win screen)

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
  - Shows encouragement for incorrect attempts

```jsx
// Win condition check
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setAttempts(attempts + 1);

  if (input.toLowerCase() === "paneer") {
    setHasWon(true); // Triggers transition to winner screen
  } else {
    // Handle incorrect attempt...
  }
};
```

## Transaction Flow Summary

1. **Authentication**:
   - Parent window sends JWT token via postMessage
   - `JwtDisplay` captures token and stores in context
   - Token is used for all subsequent API calls

2. **Payment Flow**:
   - `PaymentSection` initiates payment using `processPayment`
   - Transaction with `stake_amount` is sent to backend
   - On success, game state updates to show input form

3. **Reward Flow**:
   - Player wins by typing "paneer"
   - `WinnerScreen` shows with `WinnerRewards` component
   - Player selects reward type (cash or stamp)
   - Transaction with `payout_amount` (and optional `stamp_id`) is sent
   - Success/error feedback is displayed
