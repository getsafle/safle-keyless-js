import './scss/index.scss';
import KeylessWeb3 from './classes/KeylessWeb3';

const safleBlockchainController = require('@getsafle/blockchain-controller');


const getNetworks = async () => {
    const networks = await fetch('https://gist.githubusercontent.com/getsafle-org/0186c45d3e78a5106e472ed1ffb5f8a5/raw/b246a67911c45cad1be9e55beeaaf6a17ebff625/chainData.json').then(e=>e.json());
    //await safleBlockchainController.getNetworks();

    //for now, only allow the 4 main networks
    const allowedIds = [ 1, 3, 137, 80001 ];
    return Object.values( networks ).reduce( (acc, e) => acc.concat( e ), [] ).filter( e=> allowedIds.indexOf( e.chainId ) != -1 );

    return networks;

}


export {
    KeylessWeb3,
    getNetworks
}