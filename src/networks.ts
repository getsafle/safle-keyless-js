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
        chainId: "80001",
    }
};