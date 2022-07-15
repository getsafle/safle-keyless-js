import Web3Provider from './Web3Provider';
import { inlineS } from './../helpers/helpers';
import KeylessController from './KeylessController';
import Storage from './Storage';

class KeylessWeb3 {
    root = false
    _zIndex = false

    _loggedin = false
    _connected = false
    _activeChain = false
    _activeScreen = false
    _web3 = false
    vault = {}

    constructor( config ){
        this.allowedChains = config.blockchain;
        
        this.provider = new Web3Provider( { keylessInstance: this } );
        this.kctrl = new KeylessController( this, this.allowedChains );
        const { chainId } = this.getCurrentChain();
        this._connected = true;

        setTimeout( () => {
            this.provider.emit('connected', { chainId } );
        }, 100 );        
    }

    // public functions

    login(){
        console.log('login');

        this._connected = true;
        const { chainId } = this.getCurrentChain();
        this.provider.emit('connected', { chainId } );

        if( this._loggedin ){
            console.log('Already loggedin');
        } else {
            this._showUI('login');
        }

        return {
            error: false
        }
    }

    async isLoggedIn() {
        if (!this._loggedin) {
            // Try to retrieve user session from storage
            const { vault, decriptionKey } = Storage.getState() || {};

            // console.log( vault, decriptionKey );

            if (!vault || !decriptionKey) {
                return false;
            } else {
                await this.kctrl.loadVault();
                this._loggedin = true;
            }
        }
        // user is logged in
        return true
    }

    openDashboard(){
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('dashboard');
    }
    
    sendTransaction(){
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('send');
    }

    openSignTransaction(){
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('sign');
    }
    txnSuccess(){
        console.log('to be removed');
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('txnSuccess');
    }
    txnFailed(){
        console.log('to be removed');
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('txnFailed');
    } 
    enterPin(){
        console.log('to be removed');
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('pin');
    }
    scanQR(){
        console.log('to be removed');
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('scanQR');
    }
    selectChain(){
        if( !this._loggedin ){
            throw new Error('Please login first!');
        }
        this._showUI('SwitchChain');

    }
    disconnect(){
        this.kctrl.logout();
        this._loggedin = false;
        this._connected = false;

        setTimeout( () => this.provider.emit('disconnect', {} ), 100 );
    }

    switchNetwork( selectedChainId ){
        this._activeChain = selectedChainId;
        this.kctrl.switchNetwork( this._activeChain );
        this.provider.emit('chainChanged', { chainId: selectedChainId } );
    }
    switchWallet( wid ){
        this.kctrl.activeWallet = wid;
        this.provider.emit('accountsChanged', { address: this.kctrl.wallets[ this.kctrl.activeWallet ].address });
        Storage.saveState({ activeWallet: wid });
    }

    setNetwork(){
        
    }

    getSupportedNetworks(){

    }

    isConnected(){
        return this._connected;
    }
   
    getCurrentChain(){
        const storage = Storage.getState();
        this._activeChain =  this._activeChain || storage.chainId || 1;
        const chain =  this.allowedChains.find( e => e.chainId == this._activeChain );
        console.log('....getCurrentChain: ', this._activeChain)
        console.log('allowedChains', this.allowedChains )
        console.log('activechain', chain);
        return {
            chainId: chain.chainId,
            chain
        }
    }
    getCurrentNativeToken(){
        const currChain = this.getCurrentChain();
        // console.log( 'getnativetoken', currChain );
        return currChain.chain.symbol;
    }
    async getNativeTokenFor( chainId ){
        let activeChain = this.allowedChains.find( e => e.chainId == chainId );
        console.log('CHAIN', activeChain );
        return activeChain.symbol.toLowerCase();
    }


    // private functions
    async _showUI( screenName ){
        this._hideUI();

        const className = screenName.slice(0, 1).toUpperCase()+screenName.slice(1)+'Screen';
        this._activeScreen = await this._getInstance( className );
        
        console.log('KeylessWeb3._showUI', this._activeScreen );
        this.root = document.createElement('div');
        this.root.setAttribute('class', process.env.KEYLESS_UI_CLASSNAME );
        this.root.style.cssText = inlineS( {
            'z-index': this._getZIndex(),
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
        this.root.innerHTML = this._activeScreen.render();
        document.body.appendChild( this.root );
        this._activeScreen.setKeylessInstance( this );
        this._activeScreen.setView( this.root );
        this._activeScreen.onInit();

        setTimeout( () => this._activeScreen.onShow(), 40 );
    }
    async _hideUI(){
        if( this._activeScreen ){
            await this._activeScreen.onBeforeHide();
            try {
                document.body.removeChild( this._activeScreen.el );
            } catch( e ){
                console.log('ignored child that doens\'t exist')
            }
            this._activeScreen = null;
        }
        
    }

    async _getInstance( className ){
        let inst = await import(`./../ui/${className}.js`);
        return new inst.default;
    }

    _getZIndex(){
        //if( !this._zIndex ){
        this._zIndex = Array.from(document.querySelectorAll('body *')).reduce( (acc, el) => {
            const num = parseFloat( window.getComputedStyle(el, null).zIndex);
            return !isNaN( num )? Math.max( acc, num ) : acc;
        }, 0 );

        // console.log( this._zIndex)
        //}
        return this._zIndex + 10;
    }

}

export default KeylessWeb3;