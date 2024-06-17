import { INetwork } from "./interfaces";

export function networkAdapter(network: string | INetwork) {
  console.log("NETWORK", network);
  const networkObj =
    typeof network === "string"
      ? Object.assign({}, networks[network])
      : network;
  console.log("NetworkObj", networkObj);
  return networkObj.nodeUrl;
}

const networks: { [key: string]: INetwork } = {
  ethereum: {
    nodeUrl: "https://mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "1",
  },
  ethereumtestnet: {
    nodeUrl: "https://sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "11155111",
  },
  polygon: {
    nodeUrl:
      "https://polygon-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "137",
  },
  polygontestnet: {
    nodeUrl:
      "https://polygon-amoy.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "80002",
  },
  optimism: {
    nodeUrl:
      "https://optimism-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "10",
  },
  optimismtestnet: {
    nodeUrl:
      "https://optimism-sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "11155420",
  },
  arbitrum: {
    nodeUrl:
      "https://arbitrum-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "42161",
  },
  arbitrumtestnet: {
    nodeUrl:
      "https://arbitrum-sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "421614",
  },
  velas: {
    nodeUrl: "https://evmexplorer.velas.com/rpc",
    chainId: "106",
  },
  velastestnet: {
    nodeUrl: "https://evmexplorer.testnet.velas.com/rpc",
    chainId: "111",
  },
  mantle: {
    nodeUrl: "https://mantle-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "5000",
  },
  mantletestnet: {
    nodeUrl: "https://mantle-sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "5003",
  },
  bsc: {
    nodeUrl: "https://rpc.ankr.com/bsc",
    chainId: "56",
  },
  bsctestnet: {
    nodeUrl: "https://bsc-testnet-rpc.publicnode.com",
    chainId: "97",
  },
  "1": {
    nodeUrl: "https://mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "1",
  },
  "11155111" : {
    nodeUrl: "https://sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "11155111",
  },
  "137": {
    nodeUrl:
      "https://polygon-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "137",
  },
  "80002" : {
    nodeUrl:
      "https://polygon-amoy.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "80002",
  },
  "10": {
    nodeUrl:
      "https://optimism-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "10",
  },
  "11155420" : {
    nodeUrl:
      "https://optimism-sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "11155420",
  },
  "42161": {
    nodeUrl:
      "https://arbitrum-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "42161",
  },
  "421614" : {
    nodeUrl:
      "https://arbitrum-sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "421614",
  },
  "106": {
    nodeUrl: "https://evmexplorer.velas.com/rpc",
    chainId: "106",
  },
  "111": {
    nodeUrl: "https://evmexplorer.testnet.velas.com/rpc",
    chainId: "111",
  },
  "5000": {
    nodeUrl: "https://mantle-mainnet.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "5000",
  },
  "5003": {
    nodeUrl: "https://mantle-sepolia.infura.io/v3/2c3f34885f064b28a4af2c1dd5c8751d",
    chainId: "5003",
  },
  "56": {
    nodeUrl: "https://rpc.ankr.com/bsc",
    chainId: "56",
  },
  "97": {
    nodeUrl: "https://bsc-testnet-rpc.publicnode.com",
    chainId: "97",
  },
};