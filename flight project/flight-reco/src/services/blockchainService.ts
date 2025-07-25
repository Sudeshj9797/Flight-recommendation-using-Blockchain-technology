import { ethers } from "ethers";
import FlightBooking from "../contracts/FlightBooking.sol";

export class BlockchainService {
  private static instance: BlockchainService;
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with deployed contract address

  private constructor() {}

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  public async connectWallet(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await this.provider.send("eth_requestAccounts", []);

      const signer = this.provider.getSigner();
      this.contract = new ethers.Contract(
        this.contractAddress,
        FlightBooking.abi,
        signer
      );
    } else {
      throw new Error("Please install MetaMask!");
    }
  }

  public async createBooking(flightId: string, price: number): Promise<void> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const tx = await this.contract.createBooking(flightId, {
      value: ethers.utils.parseEther(price.toString()),
    });
    await tx.wait();
  }

  public async getBooking(flightId: string): Promise<any> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    return await this.contract.getBooking(flightId);
  }

  public async getLoyaltyPoints(address: string): Promise<number> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const points = await this.contract.getLoyaltyPoints(address);
    return points.toNumber();
  }

  public isConnected(): boolean {
    return this.contract !== null;
  }
}
