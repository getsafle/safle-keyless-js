import './scss/index.scss';
import EventEmitter from './classes/EventEmitter';
import LoginScreen from './ui/login';
import switchChainScreen from './ui/switchChain';
import SendScreen from './ui/send';

import { inlineS } from './helpers/helpers';

class Web3Provider extends EventEmitter {
    connected = false;

    constructor(){
        super();
        console.log('evt emitter');

        // this.emit('init');
        // return new Proxy( this, {
        //     get: async function( e ){
        //         console.log( 'ok' );

        //         return Promise.resolve({ ok: true });
        //     }
        // });
    }

    async request( e ){
        console.log( e );
        if( this.connected ){
            if( e.method == 'eth_signTransaction' || e.method == 'eth_sendRawTransaction' ){
                this.keyless.prepareSendTransaction( e.params );
            }

            if( e.method == 'eth_getTransactionReceipt'){
                return Promise.resolve('0x0350320502350235325');
            }

            return Promise.resolve( 10000000000000000 + (Math.random() * 10000000) );
        }
        return Promise.reject({
            type: 'ProviderRpcError',
            code: 4900,
            message: 'Disconnected',
            data: 'The Provider is disconnected from all chains.'
        });
        
    }
}

const getNetworks = async () => {

    return 

}

class Keyless {

    constructor( config ){
        this.provider = new Web3Provider();
        this.provider.keyless = this;

    }

    login(){
        console.log('login');

        this._showLogin();

        return {
            error: false
        }
    }
    choose_network(){
        console.log('netowkr');
        this._showNetwork();

        return {
            error: false
        }
    }

    disconnect(){
        this.provider.connected = false;
        this.provider.emit('disconnect');
    }

    prepareSendTransaction( params ){
        if( !this.isSending ){
            this.isSending = true;
            console.log('send transaction', params );
            this._showSend();
        }
        return;        
    }

    // fake ui
    _showLogin(){
        const screen = new LoginScreen();

        this.root = document.createElement('div');
        this.root.style.cssText = inlineS( {
            'z-index': 10000,
            'position': 'absolute',
            'width': '100vw',
            'height': '100vh',
            'left': 0, 
            'top': 0,
            'display': 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
            'justify-content': 'center'
        });
        this.root.innerHTML = screen.render();
        this.root.querySelector('.signin-btn').addEventListener('click', () => { 
            this.provider.connected = true;
            this.provider.emit('connected'); 
            this.root.parentNode.removeChild( this.root );
        });
        this.root.querySelector('.close').addEventListener('click', () => { 
            this.root.parentNode.removeChild( this.root ); 
        } );

        document.body.appendChild( this.root );
    }

    _showNetwork() {
        const screen = new switchChainScreen();

        this.root = document.createElement('div');
        this.root.style.cssText = inlineS( {
            'z-index': 10000,
            'position': 'absolute',
            'width': '100vw',
            'height': '100vh',
            'left': 0, 
            'top': 0,
            'display': 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
            'justify-content': 'center'
        });
        this.root.innerHTML = screen.render();
        this.root.querySelector('#proceed_btn').addEventListener('click', () => { 
            this.provider.connected = true;
            this.provider.emit('switchChain', { payload: { chainId: 'Polygon' }} ); 
            this.root.parentNode.removeChild( this.root );
        });
        this.root.querySelector('.close').addEventListener('click', () => { this.root.parentNode.removeChild( this.root ); } );

        document.body.appendChild( this.root );
    }

    _showSend() {
        const screen = new SendScreen();

        this.root = document.createElement('div');
        this.root.style.cssText = inlineS( {
            'z-index': 10000,
            'position': 'absolute',
            'width': '100vw',
            'height': '100vh',
            'left': 0, 
            'top': 0,
            'display': 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
            'justify-content': 'center'
        });
        this.root.innerHTML = screen.render();
        const ref = this;
        this.root.querySelector('#confirm_trans').addEventListener('click', () => { 
            this.root.parentNodde.removeChild( this.root );
            this.isSending = false;
        });

        this.root.querySelector('.close').addEventListener('click', () => { 
            this.root.parentNode.removeChild( this.root );
            this.isSending = false;
         } );

        document.body.appendChild( this.root );
    }

}

export {
    Keyless,
    getNetworks
}