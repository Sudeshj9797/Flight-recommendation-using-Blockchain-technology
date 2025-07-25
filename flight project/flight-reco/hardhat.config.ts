require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { HardhatUserConfig } = require("hardhat/config");

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  paths: {
    sources: "./src/contracts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
};

module.exports = config;
