"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkAdapter = void 0;
function networkAdapter(network) {
    console.log("NETWORK", network);
    const networkObj = typeof network === "string"
        ? Object.assign({}, networks[network])
        : network;
    console.log("NetworkObj", networkObj);
    return networkObj.nodeUrl;
}
exports.networkAdapter = networkAdapter;
const networks = {
    mainnet: {
        nodeUrl: "https://mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "1",
    },
    goerlitestnet: {
        nodeUrl: "https://goerli.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "420",
    },
    polygonmainnet: {
        nodeUrl: "https://polygon-mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "137",
    },
    mumbaitestnet: {
        nodeUrl: "https://polygon-mumbai.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "80001",
    },
    optimism: {
        nodeUrl: "https://polygon-mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "10",
    },
    optimismtestnet: {
        nodeUrl: "https://optimism-goerli.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "420",
    },
    arbitrum: {
        nodeUrl: "https://arbitrum-mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "42161",
    },
    arbitrumtestnet: {
        nodeUrl: "https://arbitrum-goerli.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "421613",
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
        nodeUrl: "http://rpc.mantle.xyz/",
        chainId: "5000",
    },
    mantletestnet: {
        nodeUrl: "https://rpc.testnet.mantle.xyz",
        chainId: "5001",
    },
    bsc: {
        nodeUrl: "https://bsc-dataseed.binance.org",
        chainId: "56",
    },
    bsctestnet: {
        nodeUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
        chainId: "97",
    },
    "1": {
        nodeUrl: "https://mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "1",
    },
    "5": {
        nodeUrl: "https://goerli.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "5",
    },
    "137": {
        nodeUrl: "https://polygon-mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "137",
    },
    "80001": {
        nodeUrl: "https://polygon-mumbai.infura.io/v3/814228beb1ff4d5991988329e57c349c",
        chainId: "80001",
    },
    "10": {
        nodeUrl: "https://optimism-mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "10",
    },
    "420": {
        nodeUrl: "https://optimism-goerli.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "420",
    },
    "42161": {
        nodeUrl: "https://arbitrum-mainnet.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "42161",
    },
    "421613": {
        nodeUrl: "https://arbitrum-goerli.infura.io/v3/eff77f64ebfd4153b083c7867ccf115d",
        chainId: "421613",
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
        nodeUrl: "http://rpc.mantle.xyz/",
        chainId: "5000",
    },
    "5001": {
        nodeUrl: "https://rpc.testnet.mantle.xyz",
        chainId: "5001",
    },
    "56": {
        nodeUrl: "https://bsc-dataseed.binance.org",
        chainId: "56",
    },
    "97": {
        nodeUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
        chainId: "97",
    },
};
