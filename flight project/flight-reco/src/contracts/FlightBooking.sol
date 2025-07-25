// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlightBooking {
    struct Booking {
        address passenger;
        string flightId;
        uint256 price;
        uint256 timestamp;
        bool isConfirmed;
    }

    mapping(string => Booking) public bookings;
    mapping(address => uint256) public loyaltyPoints;

    event BookingCreated(string flightId, address passenger, uint256 price);
    event BookingConfirmed(string flightId);
    event PointsEarned(address passenger, uint256 points);

    function createBooking(
        string memory flightId,
        uint256 price
    ) public payable {
        require(msg.value == price, "Incorrect payment amount");
        require(bookings[flightId].passenger == address(0), "Flight already booked");

        bookings[flightId] = Booking({
            passenger: msg.sender,
            flightId: flightId,
            price: price,
            timestamp: block.timestamp,
            isConfirmed: true
        });

        // Award loyalty points (1 point per 0.01 ETH spent)
        uint256 points = price / (0.01 ether);
        loyaltyPoints[msg.sender] += points;

        emit BookingCreated(flightId, msg.sender, price);
        emit PointsEarned(msg.sender, points);
    }

    function getBooking(string memory flightId) public view returns (Booking memory) {
        return bookings[flightId];
    }

    function getLoyaltyPoints(address passenger) public view returns (uint256) {
        return loyaltyPoints[passenger];
    }
} 