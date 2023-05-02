const blockchainInfo = {
    1: {
        name: 'Ethereum Mainnet',
        rpcURL: 'https://mainnet.infura.io/v3/',
        explorer: 'https://etherscan.io/tx/',
        chain_name: 'ethereum',
    },
    420: {
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
    }
}

export default blockchainInfo;