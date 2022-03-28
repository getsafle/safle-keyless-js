import blockchainInfo from './../helpers/blockchains';
import { middleEllipsis } from './../helpers/helpers';
import * as safleHelpers from './../helpers/safleHelpers';
import Storage from './../classes/Storage';
import Vault from '@getsafle/safle-vault';

class KeylessController {
    vault = false;
    wallets = [];
    activeWallet = false;
    flowState = 0;

    constructor( keylessInstance ){
        this.keylessInstance = keylessInstance;


    }

    async loadVault(){
        const state = Storage.getState();
        if( state.vault ){
            this.vault = new Vault( state.vault );
            console.log( await this.vault.getAccounts( state.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} ) ));
        } else {
            console.error('user is not logged in or vault empty.');
        }
    }

    async login( user, pass ){
        this._setLoading( true );
        console.log('login with user '+user+', pass '+pass );

        await grecaptcha.execute();
        let token = grecaptcha.getResponse();
        // console.log( token );
        const resp = await safleHelpers.login( user, pass, token );
        const safleToken = resp.data.token;
        

        //pull vault from cloud
        await grecaptcha.execute();
        token = grecaptcha.getResponse();
        const authToken = await safleHelpers.getCloudToken( user, pass, token );

        let passwordDerivedKey = await safleHelpers.generatePDKey({ safleID: user, password: pass });
        const pdkeyHash = await safleHelpers.createPDKeyHash({ passwordDerivedKey });
        const vault = await safleHelpers.retrieveVaultFromCloud( pdkeyHash, authToken );
        const encKey = await safleHelpers.retrieveEncryptionKey( pdkeyHash, authToken );
        console.log( encKey );

        Storage.saveState( { 
            vault, 
            decriptionKey: safleHelpers.decryptEncryptionKey( user, pass, Object.values( encKey ) ),
            safleID: user
        });
        this.keylessInstance._loggedin = true;

        this.loadVault();

        this._setLoading( false );
        
        this.flowState = 1;
        

        // this.keylessInstance._showUI('switchChain');
        // this.wallets = [
        //     {
        //         address: '0xb4683dffed6dcf3f3c5c046c2592880f0b4f3fb2',
        //         balance: 0.000152
        //     },

        //     {
        //         address: '0xaAB327b17c9C6399307C7b8752405830BE553D64',
        //         balance: 1.242
        //     }
        // ]

        return true;
    }
    logout(){
        Storage.saveState({vault: null})
    }

    loginSuccess( wallet ){
        this.activeWallet = wallet;

        const addreses = this.activeWallet? this.wallets[ this.activeWallet ] : this.wallets[ 0 ];
        this.keylessInstance.provider.emit('login successful', addreses );
    }

    getAccounts(){
        return this.activeWallet? this.wallets[ this.activeWallet ] : this.wallets[ 0 ];
    }


    // option transformers
    getChainsOptions( options ){
        return options.map( chain => {
            // console.log( chain );
            return {
                ...chain,
                label: blockchainInfo.hasOwnProperty( chain.chainId )? blockchainInfo[ chain.chainId ].name : chain.name+' - '+chain.network,
                icon: ''
            }
        })

    }
    async getAddressesOptions( options ){
        const balances = await this._getWalletBalances( options.map( e => e.address ) );
        // console.log( balances );

        return options.map( wallet => {
            return {
            ...wallet,
            label: middleEllipsis( wallet.address, 10 ),
            longLabel: wallet.address,
            balance: balances[ wallet.address ],
        } })
    }



    async _getWalletBalances( addreses ){
        const balances = {};
        for( var i in addreses ){
            balances[ addreses[i] ] = ( Math.random() * 1000 ) +'.'+ ( Math.random() * 1200 );
        }
        return balances;
    }

    _setLoading( flag ){
        const inst = this.keylessInstance._activeScreen;
        if( inst.hasOwnProperty('el') ){
            flag? inst.el.classList.add('loading') : inst.el.classList.remove('loading')
        }
    }
}

export default KeylessController;