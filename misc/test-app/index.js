const { KeylessWeb3, getNetworks } = require('./../../src');
import './style/app.scss';
const Web3 = require('web3');
import blockchainInfo from './../../src/helpers/blockchains';
import tokenDataAbi from './../../src/helpers/erc20-abi.js';

window.onload = async() => {

    let activeAddress = null;
    const toAddress = process.env.TEST_TO_ADDRESS;

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
    // console.log('Chosen blockchains', chosenBlockchains );
    // const env = process.env.SAFLE_ENV;

    const rpcUrls = {
        1: 'https://mainnet.infura.io/v3/' + process.env.INFURA_KEY,
        3: 'https://ropsten.infura.io/v3/' + process.env.INFURA_KEY,
        137: 'https://polygon-mainnet.infura.io/v3/' + process.env.INFURA_KEY,
        80001: 'https://polygon-mumbai.infura.io/v3/' + process.env.INFURA_KEY
    }
    for( var i in chosenBlockchains ){
        chosenBlockchains[ i ]['rpcURL'] = rpcUrls[ chosenBlockchains[i].chainId ];
    }

    try { 
        // initialize keyless with the supported chains and networks in an array objects
        const keyless = new KeylessWeb3({ blockchain: chosenBlockchains });

        // initialize web3 using keyless as a provider
        const w3 = new Web3( keyless.provider );

        add_events();
        add_ui_events();
        await update_loggedin();  
        
        function add_ui_events(){
            $('#login-btn').addEventListener('click', () => { keyless.login(); });
            $('#disconnect_btn').addEventListener('click', () => { keyless.disconnect(); });
            $('#balance-btn').addEventListener('click', async () => {
                try {
                    const activeAddress = await w3.eth.personal.getAccounts();
                    const bal = await w3.eth.getBalance( activeAddress[0] );
                    console.log( bal );
                } catch ( e ){
                    console.error( e );
                }
            });
            $('#dash-btn').addEventListener('click', ( e ) => {
                keyless.openDashboard();
            });
            $('#send-btn').addEventListener('click', ( e ) => {
                send_transaction();
            });
            $('#send-txn-btn').addEventListener('click', ( e ) => {
                send_token_transaction();
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
            w3.currentProvider.on('connect', connected_handler );
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
            w3.currentProvider.on('transactionSuccess', ( details ) => {
                console.log('transaction success', details.receipt );
                const url = keyless.getCurrentChain().chain.explorer+'/tx/'+details.receipt.transactionHash;
                console.log('url ', url );
                //show toast with transaction success
               $('#notif').innerHTML = '<div class="notification active">Transaction succeeded. <a href="'+url+'" target="_blank">View more</a></div>';
               setTimeout( () => {
                $('#notif').innerHTML = '';
               }, 11000 );
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
            if( !activeAddress ){
                // console.error({ 
                //     message: 'Provider not connected', 
                //     code: 4200,
                //     method: 'User denied the request'
                // });
                keyless.selectChain();
                return;
            }
            const nonce = await w3.eth.getTransactionCount( activeAddress, 'latest'); // nonce starts counting from 0

            const transaction = {
                'from': activeAddress,
                'to': toAddress, // faucet address to return eth
                'value': w3.utils.toWei( '0.00001', 'ether'),
                'gas': 30000,
                'gasPrice': 10,
                'nonce': nonce,
                // 'maxPriorityFeePerGas': 10,
                // 'maxFeePerGas': 10,
                'data': null,
                'type': '0x2',
            };
            const resp = await w3.eth.sendTransaction( transaction );
            
            console.log( resp );
        }

        async function send_token_transaction(){
            if( !activeAddress ){
                // console.error({ 
                //     message: 'Provider not connected', 
                //     code: 4200,
                //     method: 'User denied the request'
                // });
                keyless.selectChain();
                return;
            }
            const nonce = await w3.eth.getTransactionCount( activeAddress, 'latest'); // nonce starts counting from 0

            // const val = w3.utils.toWei( '0.00001', 'ether'),;
            const chain = keyless.getCurrentChain();
            let contractAddress;
            if( chain.chainId == 137 || chain.chainId == 90001 ){
                contractAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'; //-- POLYGON
            } else {
                contractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
            }

            const calculatedValue = w3.utils.toBN( 0.00001 * Math.pow( 10, 6 ) );
            const contractInstance = new w3.eth.Contract( tokenDataAbi, contractAddress );
            const tokenData = await contractInstance.methods.transfer(toAddress, calculatedValue).encodeABI();

            const transaction = {
                'from': activeAddress,
                'to': contractAddress, // faucet address to return eth
                'value': '0x0', 
                // 'gas': 30000,
                'nonce': nonce,
                // 'maxPriorityFeePerGas': 10,
                // 'maxFeePerGas': 10,
                'data': tokenData,
                'type': '0x2',
                'chainId': 137
            };
            const resp = await w3.eth.sendTransaction( transaction );
            
            console.log( resp );
        }

        async function sign_transaction(){
            if( !activeAddress ){
                // console.error({ 
                //     message: 'Provider not connected', 
                //     code: 4200,
                //     method: 'User denied the request'
                // });
                keyless.selectChain();
                return;
            }

            const message = 'Hello world';
            const resp = await w3.eth.sign( message, activeAddress );

            console.log( resp );
        }

    } catch( e ){
        console.error( 'an error has occured', e );
    }    
   
}