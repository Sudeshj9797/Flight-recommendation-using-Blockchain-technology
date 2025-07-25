export interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
  duration: string;
}

export class FlightService {
  private static instance: FlightService;
  private flights: Flight[] = [];

  private constructor() {
    // Initialize with some mock data for MVP
    this.flights = [
      {
        id: "FL001",
        origin: "NYC",
        destination: "LAX",
        departureTime: "2024-04-01T08:00:00",
        arrivalTime: "2024-04-01T11:00:00",
        price: 299.99,
        airline: "Delta",
        duration: "3h",
      },
      {
        id: "FL002",
        origin: "NYC",
        destination: "LAX",
        departureTime: "2024-04-01T14:00:00",
        arrivalTime: "2024-04-01T17:00:00",
        price: 349.99,
        airline: "American",
        duration: "3h",
      },
      // Add more mock flights as needed
    ];
  }

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  public async searchFlights(
    origin: string,
    destination: string,
    date: string
  ): Promise<Flight[]> {
    // In a real implementation, this would call an actual flight API
    return this.flights.filter(
      (flight) =>
        flight.origin === origin &&
        flight.destination === destination &&
        flight.departureTime.startsWith(date)
    );
  }

  public async getRecommendations(
    origin: string,
    destination: string,
    date: string,
    preferences?: {
      maxPrice?: number;
      preferredAirlines?: string[];
    }
  ): Promise<Flight[]> {
    let flights = await this.searchFlights(origin, destination, date);

    if (preferences) {
      if (preferences.maxPrice) {
        flights = flights.filter(
          (flight) => flight.price <= preferences.maxPrice!
        );
      }
      if (preferences.preferredAirlines?.length) {
        flights = flights.filter((flight) =>
          preferences.preferredAirlines!.includes(flight.airline)
        );
      }
    }

    // Sort by price for MVP
    return flights.sort((a, b) => a.price - b.price);
  }

  public async getFlightById(id: string): Promise<Flight | undefined> {
    return this.flights.find((flight) => flight.id === id);
  }
}
