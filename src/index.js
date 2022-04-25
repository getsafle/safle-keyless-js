const { KeylessWeb3, getNetworks } = require('./keyless');
import './style/app.scss';
const Web3 = require('web3');
import blockchainInfo from './keyless/helpers/blockchains';

window.onload = async() => {

    let activeAddress = null;
    // const toAddress = "0x59c7c8391de66eaaedfbd6670aecadb66cc07f79";
    const toAddress = "0x0922b7402E2C1E7503D8a757838d948FCc826D6d";

     // helper methods
     const $ = ( sel ) => {
        return document.querySelector( sel );
    }
    const $$ = ( sel ) => {
        return document.querySelectorAll( sel );
    }
    const each = ( collection, fn ) => {
        Array.from( collection ).forEach( fn );
    }

    // get the list of all networks
    const networks = await getNetworks();

    const chosenBlockchains = networks;
    console.log( chosenBlockchains );
    const env = process.env.ENV;


    try { 
        // initialize keyless with the supported chains and networks in an array objects
        const keyless = new KeylessWeb3({ blockchain: chosenBlockchains, env });

        // initialize web3 using keyless as a provider
        const w3 = new Web3( keyless.provider ); //new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b') );

        add_events();
        add_ui_events();
        update_loggedin();

        
        
        function add_ui_events(){
            $('#login-btn').addEventListener('click', () => { keyless.login(); });
            $('#disconnect_btn').addEventListener('click', () => { keyless.disconnect(); });
            $('#balance-btn').addEventListener('click', async () => { 
                const bal = await w3.eth.getBalance( activeAddress );

                console.log( bal );
            });
            $('#dash-btn').addEventListener('click', ( e ) => {
                keyless.openDashboard();
            });
            $('#send-btn').addEventListener('click', ( e ) => {
                send_transaction();
            });
            $('#txn-success-btn').addEventListener('click', ( e ) => {
                keyless.txnSuccess();
            });
            $('#txn-failed-btn').addEventListener('click', ( e ) => {
                keyless.txnFailed();
            });
            $('#nw-switch').addEventListener('click', ( e ) => {
                keyless.selectChain();
            }); 
            $('#pin-btn').addEventListener('click', ( e ) => {
                keyless.enterPin();
            });
            $('#qr-btn').addEventListener('click', ( e ) => {
                keyless.scanQR();
            });
            
        }

        function add_events(){
            w3.currentProvider.on('connected', connected_handler );
            w3.currentProvider.on('disconnect', disconnect_handler );
            w3.currentProvider.on('login successful', update_loggedin );

            w3.currentProvider.on('chainChanged', ( ch ) => {
                console.log('chain changed: ', ch);
                update_chain( ch.chainId );
                update_loggedin();
            } );
            w3.currentProvider.on('accountsChanged', ( wallet ) => {
                console.log('accounts changed: ', wallet );
                activeAddress = wallet.address;
                update_loggedin();
            });
            // w3.currentProvider.on('transactionComplete', ( receipt ) => {
            //     console.log('transaction complete', receipt );
            // });
            w3.currentProvider.on('transactionSuccess', ( receipt ) => {
                console.log('transaction success', receipt );
            });
            w3.currentProvider.on('transactionFailed', ( receipt ) => {
                console.log('transaction failed', receipt );
            });
        }

        function connected_handler( connectionInfo ){
            console.log( 'connected', connectionInfo);
            update_loggedin();
            update_chain( connectionInfo.chainId );
        }
        function disconnect_handler(){
            update_loggedin();
            update_chain( 0 );   
        }

        function update_loggedin(){
            each( $$('.active_when_logged'), ( el ) => {
                if( keyless.isLoggedIn() ){
                    el.classList.remove('disabled');
                } else {
                    el.classList.add('disabled');
                }
            });
            w3.eth.personal.getAccounts().then( ( addreses ) => {
                console.log( 'update get acc', addreses );

                activeAddress = addreses.shift();
                w3.eth.getBalance( activeAddress ).then( bal => {
                    $('.status .balance').innerHTML = bal;
                });
                

            })
            
        }
        function update_chain( chainId ){
            if( keyless.isConnected() ){
                $('.status .online-stat').classList.add('online');
                $('.status .online-stat .label').innerHTML = 'CONNECTED';
                $('.status .chain').innerHTML = blockchainInfo[ chainId ].name;
            } else {
                $('.status .online-stat').classList.remove('online');
                $('.status .online-stat .label').innerHTML = 'DISCONNECTED';
                $('.status .online-stat').classList.remove('offline');
                $('.status .chain').innerHTML = '-';
            }
            
        }

        async function send_transaction(){
            const nonce = await w3.eth.getTransactionCount( activeAddress, 'latest'); // nonce starts counting from 0

            const transaction = {
                'from': activeAddress,
                'to': toAddress, // faucet address to return eth
                'value': w3.utils.toWei( '0.001', 'ether'),
                'gas': 30000,
                // 'maxFeePerGas': 1000000108,
                'nonce': nonce,
            };
            const resp = await w3.eth.sendTransaction( transaction );
            
            console.log( resp );
        }

    } catch( e ){
        console.error( 'an error has occuried', e.message );
    }    
   
}