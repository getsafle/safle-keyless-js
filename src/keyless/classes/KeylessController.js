import Web3 from 'web3';
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
        const nodeURI = this.getNodeURI();
        this.web3 = new Web3( new Web3.providers.HttpProvider( nodeURI ));


    }

    async loadVault(){
        const state = Storage.getState();
        if( state.vault && state.decriptionKey != null ){
            this.vault = new Vault( state.vault );
            //todo - move this to helpers
            const decKey = state.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
            this.wallets = ( await this.vault.getAccounts( decKey ) ).response.map( e => { return { address: e.address }} ) || [];
            console.log( this.wallets );

            if( this.wallets.length == 0 ){
                //todo - handle empty vault case
                throw new Error('No wallets found in the current vault');
            }
            this.activeWallet = 0;
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
        
        this.keylessInstance._showUI('switchChain');
        // return true;
    }
    logout(){
        Storage.saveState({vault: null})
    }

    _loginSuccess(){
        const addreses = this.getAccounts();
        this.keylessInstance.provider.emit('login successful', addreses );
    }

    // re-build web3 instance for the current blockchain
    switchNetwork( network ){
        console.log( 'rebuild web3 object for EVM chainId '+network );
        const nodeURI = this.getNodeURI( this.keylessInstance.allowedChains[ network ].chainId );
        console.log('CHAINID', nodeURI );

        this.web3 = new Web3( new Web3.providers.HttpProvider( nodeURI ));
    }



    getAccounts( all = false ){
        return all? this.wallets : this.activeWallet? this.wallets[ this.activeWallet ] : this.wallets[ 0 ];
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

    getNodeURI( chainID = false ){
        const chainId = chainID? chainID : this.keylessInstance.getCurrentChain().chainId;
        return blockchainInfo.hasOwnProperty( chainId )? blockchainInfo[ chainId ].uri + process.env.INFURA_KEY : '';
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
        // todo - get wallet native token balances

        const balances = {};
        for( var i in addreses ){
            balances[ addreses[i] ] = await this.getWalletBalance( addreses[i].toLowerCase() );
        }
        console.log( balances );

        return balances;
    }

    async getWalletBalance( address ){
        const bal = await this.web3.eth.getBalance( address, 'latest' );
        console.log( address+': '+bal );
        const balance = this.web3.utils.fromWei( bal.toString(), 'ether' );
        return balance;
    }

    async _getWalletTokens( address ){
        //todo - get wallet tokens and balances - asset controller
        


    }

    _setLoading( flag ){
        const inst = this.keylessInstance._activeScreen;
        if( inst.hasOwnProperty('el') ){
            flag? inst.el.classList.add('loading') : inst.el.classList.remove('loading')
        }
    }
}

export default KeylessController;