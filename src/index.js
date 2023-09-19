import './scss/index.scss';
import KeylessWeb3 from './classes/KeylessWeb3';
import config from './config/config';

// import safleBlockchainController from '@getsafle/blockchain-controller';


const getNetworks = async () => {
    const networks = await fetch(config.networks).then(e => e.json());
    const allowedIds = [1, 420, 137, 80001, 106, 111, 56, 97, 5000, 5001, 10, 420, 42161, 421613];
    return Object.values(networks).reduce((acc, e) => acc.concat(e), []).filter(e => allowedIds.indexOf(e.chainId) != -1);

    return networks;

}


export {
    KeylessWeb3,
    getNetworks
}