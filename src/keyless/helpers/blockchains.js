const blockchainInfo = {
    1: {
        name: 'Ethereum Mainnet',
        uri: 'https://mainnet.infura.io/v3/',
        explorer: 'https://etherscan.io/tx/',
        chain_name: 'ethereum',
    },
    3: {
        name: 'Ropsten Testnet',
        uri: 'https://ropsten.infura.io/v3/',
        explorer: 'https://ropsten.etherscan.io/tx/',
        chain_name: 'ropsten',
    },
    137: {
        name: 'Polygon Mainnet',
        uri: 'https://polygon-mainnet.infura.io/v3/',
        explorer: 'https://polygonscan.com/tx/',
        chain_name: 'polygon',
    },
    80001: {
        name: 'Mumbai Testnet',
        uri: 'https://polygon-mumbai.infura.io/v3/',
        explorer: 'https://mumbai.polygonscan.com/tx/',
        chain_name: 'mumbai',
    }
}

export default blockchainInfo;