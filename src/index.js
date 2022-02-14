const { Keyless, getNetworks } = require('./keyless');
import './style/app.scss';
const Web3 = require('web3');

window.onload = async() => {
    

    // get the list of all networks
    const networks = await getNetworks();

    const chain = 1;
    const network = 'mainnet';
    const env = 'dev';

    try {
        // initialize keyless with the supported chains and networks in an array objects
        const keyless = new Keyless({ blockchain: [{ chain, network }], env });

        // initialize web3 using keyless as a provider
        const w3 = new Web3( keyless.provider ); //new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b') );

        // event handling from web3 provider
        w3.currentProvider.on('connected', function( ){
            console.log('conncted');
            document.querySelectorAll('#balance-btn, #nw-switch, #send, #sign').forEach( e => e.classList.remove('disabled') );
        });
        w3.currentProvider.on('disconnect', function( ){
            console.log('disconncted');
            document.querySelectorAll('#balance-btn, #nw-switch, #send, #sign').forEach( e => e.classList.add('disabled') );
            document.querySelector('#balance').innerHTML = '';
        });
        w3.currentProvider.on('switchChain', function( e ) {
            document.querySelector('#chain').innerHTML = '> '+ e.payload.chainId;
        });
        document.querySelectorAll('#balance-btn, #nw-switch, #send, #sign').forEach( e => e.classList.add('disabled') );




        async function login() {
            const { error } = await keyless.login();
    
            if (error) {
                return { error };
            }
    
            return 'Login successful'
            //emit login successful event
        }

        function disconnect(){
            keyless.disconnect();
        }
        function get_balance(){
            w3.eth.getBalance('0x5b5fa92a800c6bd94346c08ffe586aa211bc889c').then( function( resp ){
                console.log('response from web3: ', resp );
                document.querySelector('#balance').innerHTML = 'Balance: '+ parseFloat( w3.utils.fromWei( resp.toString(), 'ether' ) ).toFixed(2) +' ETH';
            }).catch( e => {
                console.error( e )
                document.querySelector('#balance').innerHTML = 'Error connecting';
            });
        }

        function switch_chain(){
            keyless.choose_network();
        }

        function send_transaction(){
            w3.eth.sendSignedTransaction( w3.eth.signTransaction( {
                from: '0x5b5fa92a800c6bd94346c08ffe586aa211bc889c',
                to: '0x5b5fa92a800346d94346c08ffe586aa211bc5356',
                value: '1000000000000',
                gas: '0x20'
            } ), '0x0010520135023052306023603260');
        }

        async function sign_message(){
            const res = w3.eth.accounts.sign( 'hello', 'efc95aac4db655328284160147b77318df12cb055c9012d3ba5a54098b37289b');
            
            w3.eth.sendSignedTransaction( res );
        }
    
        document.querySelector('#login-btn').addEventListener('click', login );
        document.querySelector('#disconnect_btn').addEventListener('click', disconnect );
        document.querySelector('#balance-btn').addEventListener('click', get_balance );
        document.querySelector('#nw-switch').addEventListener('click', switch_chain );
        document.querySelector('#send').addEventListener('click', send_transaction );
        document.querySelector('#sign').addEventListener('click', sign_message );

    } catch( e ){
        console.error( 'an error has occuried', e.message );
    }    

   
}