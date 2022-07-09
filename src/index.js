const { KeylessWeb3, getNetworks } = require('./keyless');
import './style/app.scss';
const Web3 = require('web3');
import blockchainInfo from './keyless/helpers/blockchains';

window.onload = async() => {

    let activeAddress = null;
    // const toAddress = "0x59c7c8391de66eaaedfbd6670aecadb66cc07f79";
    // const toAddress = "0x0922b7402E2C1E7503D8a757838d948FCc826D6d";
    const toAddress = '0xca878f65d50caf80a84fb24e40f56ef05483e1cb';

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
    console.log('Chosen blockchains', chosenBlockchains );
    const env = process.env.ENV;


    try { 
        // initialize keyless with the supported chains and networks in an array objects
        const keyless = new KeylessWeb3({ blockchain: chosenBlockchains, env });

        // initialize web3 using keyless as a provider
        const w3 = new Web3( keyless.provider ); //new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b') );

        add_events();
        add_ui_events();
        await update_loggedin();  
        
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
            $('#sign-btn').addEventListener('click', ( e ) => {
                // keyless.openSignTransaction();
                sign_transaction();
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

        async function connected_handler( connectionInfo ){
            console.log( 'connected', connectionInfo);
            await update_loggedin();
            update_chain( connectionInfo.chainId );
        }
        async function disconnect_handler(){
            console.log('disconnected');
            await update_loggedin();
            update_chain( 0 );   
        }

        async function update_loggedin() {
            const isUserLoggedIn = await keyless.isLoggedIn();
            console.log('is loggedin', isUserLoggedIn );
            each( $$('.active_when_logged'), ( el ) => {
                if( isUserLoggedIn ){
                    el.classList.remove('disabled');
                } else {
                    el.classList.add('disabled');
                }
            });

            if( isUserLoggedIn ) {
                await w3.eth.personal.getAccounts().then( async ( addreses ) => {
                    // let activeAddress

                    if (Array.isArray( addreses ) && addreses.length > 0) {
                        activeAddress = addreses.shift();
                        
                    } else if (typeof addreses === 'string' && addreses.length > 0) {
                        activeAddress = addreses;
                        console.log('One address: ', addreses, addreses.length);
                    }
                    if (!activeAddress) {
                        console.log('No active Adrress!');
                        return false;
                    }

                    await w3.eth.getBalance( activeAddress ).then( bal => {
                        // console.log('GET BALANCE', bal.toString() );
                        $('.status .balance').innerHTML = parseFloat( w3.utils.fromWei( bal, 'ether')).toFixed(5);
                    });
                })
            }
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

        async function sign_transaction(){
            const message = 'Hello world';
            const resp = await w3.eth.sign( message, activeAddress );

            console.log( resp );
        }

    } catch( e ){
        console.error( 'an error has occured', e );
    }    
   
}