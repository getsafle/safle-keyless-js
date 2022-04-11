import Web3 from 'web3';
import blockchainInfo from './../helpers/blockchains';
import { middleEllipsis, formatPrice, formatXDecimals } from './../helpers/helpers';
import * as safleHelpers from './../helpers/safleHelpers';
import Storage from './../classes/Storage';
import Vault from '@getsafle/safle-vault';
import asset_controller  from '@getsafle/asset-controller';

class KeylessController {
    vault = false;
    wallets = [];
    activeWallet = false;
    flowState = 0;
    activeTransaction = null;

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
        // console.log( encKey );

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


    // send transaction func
    sendTransaction( config ){
        this.activeTransaction = {
            data: config,
        };
        this.activeTransaction.promise = new Promise( ( res, rej ) => {
            this.keylessInstance._showUI('send');
            this.activeTransaction.resolve = res;
            this.activeTransaction.reject = rej;
        });
        return this.activeTransaction.promise;
    }

    getActiveTransaction(){
        if( this.activeTransaction ){
            return this.activeTransaction;
        }
        return null;
    }
    clearActiveTransaction( reject = false ){
        if( reject && !this.activeTransaction.promise.fulfilled ){
            this.activeTransaction.reject({
                message: 'User rejected the transaction',
                code: 4200,
                method: 'User rejected'
            })
        }
        this.activeTransaction = null;
    }


    getAccounts( all = false ){
        return all? this.wallets : this.activeWallet? this.wallets[ this.activeWallet ] : this.wallets[ 0 ];
    }

    async getTokens(){
        // const address = this.getAccounts();
        const chain = blockchainInfo[ this.keylessInstance.getCurrentChain()?.chainId ].chain_name;
        const assets = new asset_controller.AssetController({ chain: chain , rpcURL: this.getNodeURI() });
        const erc20Balance = await assets.detectTokens('erc20');

        return erc20Balance;
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

    async getBalanceInUSD( balance ){
        try {
            const nativeTokenName = await this.getCurrentNativeToken();
            
           let res = await fetch(`${process.env.SAFLE_TOKEN_API}/latest-price?coin=${nativeTokenName}`).then(e=>e.json());
            const rate = res.data?.data[ nativeTokenName.toUpperCase() ]?.quote?.USD?.price;
            
            const priceUSD = isNaN( rate )? 0 : rate;
            console.log( balance, priceUSD );
            return formatXDecimals( parseFloat( balance ) * parseFloat( priceUSD ), 3 );
        } catch( e ){
            console.log('Error fetching usd balance', e.message );
            return 0;
        }
    }

    async getCurrentNativeToken(){
        let activeChain = await this.keylessInstance.getCurrentChain();
        return activeChain.chain.symbol.toLowerCase();
    }

    getFeeInEth( number ){
        return this.web3.utils.fromWei( this.web3.utils.toWei( number.toString(), 'gwei').toString(), 'ether');
    }

    async estimateGas( { to, from, value } ){
        try {
            const res = await this.web3.eth.estimateGas( { to, from, value } );
            return res;
        } catch ( e ){
            return 21000;
        }
    }

    async estimateFees(){
        let activeChain = await this.keylessInstance.getCurrentChain();
        const eth_node = blockchainInfo[ activeChain.chainId ].uri;

        try {    
            let response;
            if( eth_node.indexOf('polygon-mumbai') != -1 ){
                return {
                    estimatedBaseFee: '0',
                    high: {
                        maxWaitTimeEstimate: 10*1000,
                        minWaitTimeEstimate: 5*1000,
                        suggestedMaxFeePerGas: 250,
                        suggestedMaxPriorityFeePerGas: 250
                        
                    },
                    medium: {
                        maxWaitTimeEstimate: 30*1000,
                        minWaitTimeEstimate: 10*1000,
                        suggestedMaxFeePerGas: 180,
                        suggestedMaxPriorityFeePerGas: 180
                    }, 
                    low: {
                        maxWaitTimeEstimate: 60*1000,
                        minWaitTimeEstimate: 30*1000,
                        suggestedMaxFeePerGas: 140,
                        suggestedMaxPriorityFeePerGas: 140
                    }
                };
            } 

            if( eth_node.indexOf('polygon') != -1 ){
                //fetch gas for polygon
                const url = `https://gasstation-mainnet.matic.network/`;
                let resp = await this.getRequest( { url} );

                if( !resp ){
                    resp = {
                        fastest: 0, 
                        standard: 0, 
                        fast: 0                       
                    }
                }

                // console.log( resp );

                response = {
                    estimatedBaseFee: '0',
                    high: {
                        maxWaitTimeEstimate: 10*1000,
                        minWaitTimeEstimate: 5*1000,
                        suggestedMaxFeePerGas: resp.fastest,
                        suggestedMaxPriorityFeePerGas: resp.fastest
                        
                    },
                    medium: {
                        maxWaitTimeEstimate: 30*1000,
                        minWaitTimeEstimate: 10*1000,
                        suggestedMaxFeePerGas: resp.fast,
                        suggestedMaxPriorityFeePerGas: resp.fast
                    }, 
                    low: {
                        maxWaitTimeEstimate: 60*1000,
                        minWaitTimeEstimate: 30*1000,
                        suggestedMaxFeePerGas: resp.standard,
                        suggestedMaxPriorityFeePerGas: resp.standard
                    }
                };

            } else {
                const chainId = activeChain.chainId;
                const url = `https://gas-api.metaswap.codefi.network/networks/${chainId}/suggestedGasFees`;
                response = await this.getRequest({ url });
            }

            return response;            
        } catch( e ){
            console.log('error', e );
            return null;
        }
    }

    async getRequest( { url } ){
        const resp = await fetch( url ).then( e => e.json() ).catch( e => {
            console.log('error fetching estimats', e );
            return null;
        });
        return resp;
    }

    _setLoading( flag ){
        const inst = this.keylessInstance._activeScreen;
        if( inst.hasOwnProperty('el') ){
            flag? inst.el.classList.add('loading') : inst.el.classList.remove('loading')
        }
    }
}

export default KeylessController;