const { ethers } = require("hardhat");

async function main() {
  // Deploy the contract
  const FlightBooking = await ethers.getContractFactory("FlightBooking");
  const flightBooking = await FlightBooking.deploy();
  await flightBooking.waitForDeployment();

  console.log("FlightBooking deployed to:", await flightBooking.getAddress());

  // Test creating a booking
  const [owner] = await ethers.getSigners();
  const flightId = "FL001";
  const price = ethers.parseEther("0.1"); // 0.1 ETH

  console.log("Creating booking...");
  const tx = await flightBooking.createBooking(flightId, price, {
    value: price,
  });
  await tx.wait();
  console.log("Booking created!");

  // Test getting the booking
  const booking = await flightBooking.getBooking(flightId);
  console.log("Booking details:", {
    passenger: booking.passenger,
    flightId: booking.flightId,
    price: ethers.formatEther(booking.price),
    timestamp: new Date(Number(booking.timestamp) * 1000).toLocaleString(),
    isConfirmed: booking.isConfirmed,
  });

  // Test getting loyalty points
  const points = await flightBooking.getLoyaltyPoints(owner.address);
  console.log("Loyalty points:", points.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
