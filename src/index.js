const { default: KeylessWeb3 } = require("./keyless");

import './style/app.scss';

const Web3 = require('web3');

window.onload = async() => {

    let kl = new KeylessWeb3();

    const web3 = new Web3( kl.provider );

    // const accounts = await web3.eth.getAccounts();

    const receipt = await web3.eth.sendSignedTransaction( { to: '0x01052105215', from: '03053205', value: '0.002' });

    document.querySelector('#login-btn').addEventListener('click', () => {
        kl.login();
    })
}