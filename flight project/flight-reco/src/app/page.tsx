"use client";

import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  TicketIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Add proper type for window.ethereum
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider & {
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (
        event: string,
        callback: (accounts: string[]) => void
      ) => void;
    };
  }
}

interface Flight {
  id: string;
  origin: string;
  destination: string;
  price: string;
  airline: string;
  departureTime: string;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const flights: Flight[] = [
    {
      id: "FL003",
      origin: "LHR",
      destination: "JFK",
      price: "0.15",
      airline: "Global Airways",
      departureTime: "2024-04-11T09:30:00",
    },
    {
      id: "FL004",
      origin: "DXB",
      destination: "SIN",
      price: "0.12",
      airline: "Emirates",
      departureTime: "2024-04-12T22:15:00",
    },
    {
      id: "FL005",
      origin: "HND",
      destination: "ICN",
      price: "0.09",
      airline: "Japan Airlines",
      departureTime: "2024-04-13T08:45:00",
    },
    {
      id: "FL007",
      origin: "CDG",
      destination: "FRA",
      price: "0.07",
      airline: "Air France",
      departureTime: "2024-04-15T16:00:00",
    },
    {
      id: "FL008",
      origin: "MIA",
      destination: "ORD",
      price: "0.06",
      airline: "American Airlines",
      departureTime: "2024-04-16T13:30:00",
    },
    {
      id: "FL009",
      origin: "SFO",
      destination: "SEA",
      price: "0.05",
      airline: "Alaska Airlines",
      departureTime: "2024-04-17T07:15:00",
    },
  ];

  // Add useEffect to handle window.ethereum events
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsConnected(false);
        setAccount("");
      } else {
        setAccount(accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        toast.success("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    } else {
      toast.error("Please install MetaMask to connect your wallet.");
    }
  };

  const bookFlight = async (flight: Flight) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsBooking(true);
    try {
      if (!window.ethereum) {
        throw new Error("No ethereum provider found");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      const contractABI = [
        "function createBooking(string memory flightId, uint256 price) public payable",
        "function getBooking(string memory flightId) public view returns (tuple(address passenger, string flightId, uint256 price, uint256 timestamp, bool isConfirmed))",
        "function getLoyaltyPoints(address passenger) public view returns (uint256)",
      ];

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const price = ethers.parseEther(flight.price);

      const tx = await contract.createBooking(flight.id, price, {
        value: price,
      });
      await tx.wait();

      toast.success("Booking successful!", {
        duration: 5000,
        icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      });
    } catch (error) {
      console.error("Error booking flight:", error);

      if (error instanceof Error && "code" in error) {
        const ethersError = error as { code: string };
        if (ethersError.code === "INSUFFICIENT_FUNDS") {
          toast.error(
            "Insufficient funds in your wallet. Please add more ETH to complete the booking.",
            {
              duration: 6000,
              icon: (
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              ),
            }
          );
        } else if (ethersError.code === "ACTION_REJECTED") {
          toast.error("Transaction was rejected. Please try again.", {
            duration: 4000,
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
          });
        } else {
          toast.error("Error booking flight. Please try again.", {
            duration: 4000,
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
          });
        }
      } else {
        toast.error("Error booking flight. Please try again.", {
          duration: 4000,
          icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
        });
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-white shadow-lg rounded-lg",
          style: {
            border: "1px solid #e5e7eb",
            padding: "16px",
            color: "#374151",
          },
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Flight Bookings
            </h1>
            <p className="text-gray-600">
              Book your flights with blockchain technology
            </p>
          </div>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <WalletIcon className="h-5 w-5" />
              Connect Wallet
            </button>
          ) : (
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <WalletIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Flights Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PaperAirplaneIcon className="h-6 w-6 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      {flight.airline}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Flight #{flight.id}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.origin}
                    </div>
                    <div className="text-sm text-gray-500">From</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-0.5 bg-gray-200 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="h-1 w-1 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.destination}
                    </div>
                    <div className="text-sm text-gray-500">To</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-5 w-5" />
                    <span>
                      {new Date(flight.departureTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CurrencyDollarIcon className="h-5 w-5" />
                    <span className="font-semibold">{flight.price} ETH</span>
                  </div>
                </div>

                <button
                  onClick={() => bookFlight(flight)}
                  disabled={!isConnected || isBooking}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <TicketIcon className="h-5 w-5" />
                  {isBooking
                    ? "Booking..."
                    : isConnected
                    ? "Book Now"
                    : "Connect Wallet to Book"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">
              Built with ❤️ by{" "}
              <a
                href="https://www.linkedin.com/in/prakash-nalawade-45050829b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Prakash Nalawde
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
