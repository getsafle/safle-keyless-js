const blockchainInfo = {
    1: {
        name: 'Ethereum Mainnet',
        rpcURL: 'https://mainnet.infura.io/v3/',
        explorer: 'https://etherscan.io/tx/',
        chain_name: 'ethereum',
    },
    5: {
        name: 'Goerli Testnet',
        rpcURL: 'https://goerli.infura.io/v3/',
        explorer: 'https://goerli.etherscan.io/tx/',
        chain_name: 'goerli',
    },
    137: {
        name: 'Polygon Mainnet',
        rpcURL: 'https://polygon-mainnet.infura.io/v3/',
        explorer: 'https://polygonscan.com/tx/',
        chain_name: 'polygon',
    },
    80001: {
        name: 'Mumbai Testnet',
        rpcURL: 'https://polygon-mumbai.infura.io/v3/',
        explorer: 'https://mumbai.polygonscan.com/tx/',
        chain_name: 'mumbai',
    },
    106: {
      name: "Velas Mainnet",
      rpcURL: "https://evmexplorer.velas.com/rpc",
      explorer: "https://evmexplorer.velas.com/tx/",
      chain_name: "velas",
    },
    111: {
      name: "Velas Testnet",
      rpcURL: "https://evmexplorer.testnet.velas.com/rpc",
      explorer: "https://evmexplorer.testnet.velas.com/tx/",
      chain_name: "velas testnet",
    },
    56: {
      name: "BSC Mainnet",
      rpcURL: "https://bsc-dataseed.binance.org",
      explorer: "https://bscscan.com/tx/",
      chain_name: "bsc",
    },
    97: {
      name: "BSC testnet",
      rpcURL: "https://data-seed-prebsc-1-s1.binance.org:8545",
      explorer: "https://testnet.bscscan.com/tx/",
      chain_name: "bsc testnet",
    },
    5000: {
        name: "Mantle Mainnet",
        rpcURL: "https://rpc.mantle.xyz/",
        explorer: "https://explorer.mantle.xyz/tx/",
        chain_name: "mantle",
    },
    5001: {
        name: "Mantle Testnet",
        rpcURL: "https://rpc.testnet.mantle.xyz",
        explorer: "https://explorer.testnet.mantle.xyz/tx/",
        chain_name: "mantle testnet",
    },
    10: {
        name: "Optimism Mainnet",
        rpcURL: "https://optimism-mainnet.infura.io/v3/",
        explorer: "https://optimistic.etherscan.io/tx/",
        chain_name: "optimism",
    },
    420: {
        name: "Goerli Testnet",
        rpcURL: "https://optimism-goerli.infura.io/v3/",
        explorer: "https://goerli-optimism.etherscan.io/tx/",
        chain_name: "optimism goerli",
    },
    42161: {
        name: "Arbitrum Mainnet",
        rpcURL: "https://arbitrum-mainnet.infura.io/v3/",
        explorer: "https://arbiscan.io/tx/",
        chain_name: "arbitrum",
    },
    421613: {
        name: "Arbitrum Testnet",
        rpcURL: "https://arbitrum-goerli.infura.io/v3/",
        explorer: "https://testnet.arbiscan.io/tx/",
        chain_name: "arbitrum goerli",
    }
}

export default blockchainInfo;