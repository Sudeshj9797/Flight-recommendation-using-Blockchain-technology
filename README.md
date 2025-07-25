# Flight Booking System with Blockchain Integration

A decentralized flight booking system that allows users to book flights using blockchain technology. The system includes smart contract-based booking management and a loyalty points system.

## Features

- Smart contract-based flight bookings
- Loyalty points system
- Real-time transaction processing
- Modern UI with Next.js and Tailwind CSS
- MetaMask wallet integration

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat
- **Blockchain**: Ethereum (Local Development)
- **Wallet Integration**: MetaMask

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension
- Git

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd flight-reco
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the local Hardhat network**
   Open a new terminal and run:

   ```bash
   npx hardhat node
   ```

   This will start a local Ethereum network with 20 test accounts.

4. **Deploy the smart contract**
   Open another terminal and run:

   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

   Copy the deployed contract address and update it in `src/app/page.tsx`.

5. **Configure MetaMask**

   - Open MetaMask
   - Click the network dropdown
   - Click "Add Network"
   - Add these details:
     - Network Name: Hardhat Local
     - RPC URL: http://127.0.0.1:8545
     - Chain ID: 31337
     - Currency Symbol: ETH
   - Import one of the test accounts from the Hardhat node output using its private key

6. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Smart Contract

The system uses a Solidity smart contract (`FlightBooking.sol`) that handles:

- Flight bookings
- Payment processing
- Loyalty points management

Key functions:

- `createBooking`: Creates a new flight booking and awards loyalty points
- `getBooking`: Retrieves booking details
- `getLoyaltyPoints`: Checks user's loyalty points

### Frontend

The Next.js frontend provides:

- Flight listing and details
- Wallet connection via MetaMask
- Booking interface
- Transaction status updates

### Booking Process

1. User connects their MetaMask wallet
2. Views available flights
3. Selects a flight and clicks "Book Now"
4. Confirms the transaction in MetaMask
5. Smart contract processes the booking and awards loyalty points
6. User receives booking confirmation

### Loyalty Points System

- Users earn 1 loyalty point for every 0.01 ETH spent
- Points are stored on the blockchain
- Points can be viewed through the smart contract

## Testing

To test the contract functionality:

```bash
npx hardhat run scripts/test.ts --network localhost
```

This will:

1. Deploy the contract
2. Create a test booking
3. Display booking details
4. Show earned loyalty points

## Security Considerations

- Never share your private keys
- Use test networks for development
- Keep your MetaMask secure
- Verify all transactions before confirming

## Future Enhancements

- Flight search and filtering
- Advanced loyalty program features
- Multiple airline integration
- Refund and cancellation system
- User profile management

## License

MIT License - feel free to use this project for your own purposes.
