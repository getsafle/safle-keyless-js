import { INetwork } from './interfaces';

export function networkAdapter(network: string | INetwork) {
    console.log("NETWORK", network);
  const networkObj = typeof network === 'string' ? Object.assign({}, networks[network]) : network;
    console.log("NetworkObj",networkObj);
  return networkObj.nodeUrl;
}

const networks: { [key: string]: INetwork } = {
    mainnet: {
        nodeUrl: 'https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '1',
    },
    goerlitestnet: {
        nodeUrl: 'https://goerli.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '420',
    },
    polygonmainnet: {
        nodeUrl: 'https://polygon-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '137',
    },
    mumbaitestnet: {
        nodeUrl: 'https://polygon-mumbai.infura.io/v3/814228beb1ff4d5991988329e57c349c',
        chainId: '80001',
    },
    optimism: {
        nodeUrl: 'https://polygon-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '10',
    },
    arbitrum: {
        nodeUrl: 'https://arbitrum-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '42161',
    },
    velas: {
        nodeUrl: 'https://evmexplorer.velas.com/rpc',
        chainId: '106',
    },
    mantle: {
        nodeUrl: 'http://rpc.mantle.xyz/',
        chainId: '5000',
    },
    bsc: {
        nodeUrl: 'https://bsc-dataseed.binance.org',
        chainId: '56',
    },
    '1': {
        nodeUrl: 'https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '1',
    },
    '420': {
        nodeUrl: 'https://goerli.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '420',
    },
    '137': {
        nodeUrl: 'https://polygon-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '137',
    },
    '80001': {
        nodeUrl: 'https://polygon-mumbai.infura.io/v3/814228beb1ff4d5991988329e57c349c',
        chainId: '80001',
    },
    '10': {
        nodeUrl: 'https://polygon-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '10',
    },
    '42161': {
        nodeUrl: 'https://arbitrum-mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b',
        chainId: '42161',
    },
    '106': {
        nodeUrl: 'https://evmexplorer.velas.com/rpc',
        chainId: '106',
    },
    '5000': {
        nodeUrl: 'http://rpc.mantle.xyz/',
        chainId: '5000',
    },
    '56': {
        nodeUrl: 'https://bsc-dataseed.binance.org',
        chainId: '56',
    }

};
