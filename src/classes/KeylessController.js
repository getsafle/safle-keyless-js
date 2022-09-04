import Web3 from 'web3';
import blockchainInfo from './../helpers/blockchains';
import { middleEllipsis, formatPrice, formatXDecimals } from './../helpers/helpers';
import * as safleHelpers from './../helpers/safleHelpers';
import Storage from './../classes/Storage';
import Vault from '@getsafle/safle-vault';
import asset_controller  from '@getsafle/asset-controller';
const safleIdentity = require('@getsafle/safle-identity-wallet').SafleID;
import config from './../config/config';

const { FeeMarketEIP1559Transaction, Transaction } = require('@ethereumjs/tx');
const Common = require('@ethereumjs/common').default;
const { Hardfork } = require('@ethereumjs/common');
const { bufferToHex }=require('ethereumjs-util');


class KeylessController {
    vault = false;
    wallets = [];
    activeChain;
    activeWallet;
    flowState = 0;
    activeTransaction = null;
    activeSignRequest = null;
    transactionHashes = [];
    _lastReceipt = null;
    tokenData = {};
    _isMobileVault = false;

    constructor( keylessInstance, chains = [] ){
        this.keylessInstance = keylessInstance;
        if( chains[0].hasOwnProperty('rpcURL') ){
            this._setBlockchainRPC( chains );
        }
        const state = Storage.getState();
        const { chainId: sessionChainId = '', activeWallet: sessionActiveWallet = false } = state;
        if (sessionChainId) {
            this.activeChain = this.keylessInstance.allowedChains.find( e => e.chainId == sessionChainId );
            
            this.activeWallet = sessionActiveWallet;
            
            this.loadVault().then( () => {
                this.keylessInstance._loggedin = true;
                this._loginSuccess( false );
            });
        }
        const nodeURI = this.getNodeURI(this.activeChain?.chainId);
        
        this.web3 = new Web3( new Web3.providers.HttpProvider( nodeURI ));

        this.loadTokenData();
    }

    async loadVault(){
        const state = Storage.getState();
        if( state.hasOwnProperty('isMobile') ){
            this._isMobileVault = state.isMobile;
        }

        if( state.vault && state.decriptionKey != null ){
            this.vault = new Vault( state.vault );
            const decKey = state.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
            try {
                const acc = await this.vault.getAccounts( decKey );
                

                this.wallets = acc.response.map( e => { return { address: e.address }} ) || [];
                
            } catch( e ){
                this.wallets = [];
                
            }

            if( this.wallets.length == 0 ){
                throw new Error('No wallets found in the current vault');
            }
            this.activeWallet = state?.activeWallet || 0;
        } else {
            console.error('user is not logged in or vault empty.');
        }
    }

    async login( user, pass ){
        if( !window.grecaptcha ){
            
        }
        this._setLoading( true );
        

        this._isMobileVault = await this._getIsVaultMobile( user );
        

        await grecaptcha.execute();
        let captchaToken = grecaptcha.getResponse();
        
        const resp = await safleHelpers.login( user, pass, captchaToken );
        const safleToken = resp.data.token;
        

        
        await grecaptcha.execute();
        captchaToken = grecaptcha.getResponse();
        const authToken = await safleHelpers.getCloudToken( user, pass, captchaToken );

        let passwordDerivedKey = await safleHelpers.generatePDKey({ safleID: user, password: pass });
        const pdkeyHash = await safleHelpers.createPDKeyHash({ passwordDerivedKey });
        const vault = await safleHelpers.retrieveVaultFromCloud( pdkeyHash, authToken );
        const encKey = await safleHelpers.retrieveEncryptionKey( pdkeyHash, authToken );
        

        Storage.saveState( { 
            vault, 
            decriptionKey: safleHelpers.decryptEncryptionKey( user, pass, Object.values( encKey ) ),
            safleID: user,
            isMobile: this._isMobileVault
        });
        this.keylessInstance._loggedin = true;

        await this.loadVault();

        this._setLoading( false );
        
        this.flowState = 1;
        
        this.keylessInstance._showUI('switchChain');
        
    }
    logout(){
        this.keylessInstance._loggedin = false;
        Storage.clear();
    }

    _loginSuccess( openDashboard = true ){
        const addreses = this.getAccounts();
        this.keylessInstance._connected = true;
        const chainId = this.keylessInstance.getCurrentChain()?.chainId;
        this.keylessInstance.provider.emit('connect', { chainId });

        setTimeout( () => {
            this.keylessInstance.provider.emit('login successful', addreses );
            if( openDashboard ){
                this.keylessInstance.openDashboard();
            }
        }, 50 );
    }

    switchNetwork( chainId){
        
        this.web3 = this.generateWeb3Object(chainId);
        Storage.saveState({ chainId });
    }

    generateWeb3Object(chainId) {
        const nodeURI = this.getNodeURI(chainId);
        return new Web3( new Web3.providers.HttpProvider( nodeURI ));
    }

    signTransaction( address, data ){
        this.activeSignRequest = {
            data: data,
            address: address
        };
        this.activeSignRequest.promise = new Promise( ( res, rej ) => {
            if( this._isMobileVault ){
                this.keylessInstance._showUI('scanQR');
            } else {
                this.keylessInstance._showUI('sign');
            }
            this.activeSignRequest.resolve = res;
            this.activeSignRequest.reject = rej;
        });
        return this.activeSignRequest.promise;
    }

    getSignRequestData(){
        if( this.activeSignRequest ){
            return this.web3.utils.hexToUtf8( this.activeSignRequest.data );
        } else {
            throw new Error('No active signed request');
            return '';
        }
    }

    sendTransaction( config ){
        const trans = this._sanitizeTransaction( config );
        if( !trans ){
            return;
        }
        this.activeTransaction = {
            data: trans,
        };
        this.activeTransaction.promise = new Promise( ( res, rej ) => {
            if( this._isMobileVault ){
                this.keylessInstance._showUI('scanQR');
            } else {
                this.keylessInstance._showUI('send');
            }
            
            this.activeTransaction.resolve = res;
            this.activeTransaction.reject = rej;
        });
        return this.activeTransaction.promise;
    }

    setGasForTransaction( gasLimit, maxFeePerGas, maxPriorityFee ){
        if( this.activeTransaction ){
            this.activeTransaction.data.gasLimit = gasLimit;
            this.activeTransaction.data.maxFeePerGas = maxFeePerGas;
            this.activeTransaction.data.maxPriorityFeePerGas = maxPriorityFee;
        }
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
        const address = this.getAccounts().address;
        const chain = blockchainInfo[ this.keylessInstance.getCurrentChain()?.chainId ].chain_name;
        
        const assets = new asset_controller.AssetController({ chain , rpcURL: this.getNodeURI() });
        const erc20Balance = await assets.detectTokens({ tokenType: 'erc20', userAddress: address });

        return erc20Balance;
    }

    getChainsOptions( options ){
        return options.map( chain => {
            return {
                ...chain,
                label: blockchainInfo.hasOwnProperty( chain.chainId )? blockchainInfo[ chain.chainId ].name : chain.name+' - '+chain.network,
                icon: ''
            }
        })
    }

    getNodeURI( chainID = false ){
        const chainId = chainID? chainID : this.keylessInstance.getCurrentChain().chainId;
        return blockchainInfo.hasOwnProperty( chainId )? blockchainInfo[ chainId ].rpcURL : '';
    }

    async getAddressesOptions( options, web3Obj){
        const balances = await this._getWalletBalances( options.map( e => e.address ), web3Obj );

        return options.map( wallet => {
            return {
            ...wallet,
            label: middleEllipsis( wallet.address, 10 ),
            longLabel: wallet.address,
            balance: balances[ wallet.address ],
        } })
    }

    async _getWalletBalances( addreses, web3Obj ){
        const balances = {};
        for( var i in addreses ){
            balances[ addreses[i] ] = await this.getWalletBalance( addreses[i].toLowerCase(), true, false, web3Obj );
        }
        return balances;
    }

    async getWalletBalance( address, returnETH = false, digits=false, web3Obj = this.web3 ){
        const bal = await web3Obj.eth.getBalance( address, 'latest' );
        if( returnETH ){
            const balance = web3Obj.utils.fromWei( bal.toString(), 'ether' );
            return digits ? parseFloat(balance).toFixed(digits) : balance;
        }
        return bal;
    }

    async getBalanceInUSD( balance ){
        try {
            const nativeTokenName = await this.getCurrentNativeToken();

            if (!config.SAFLE_TOKEN_API) {
                throw new Error('Please check the environment variables...');
            }
            
           let res = await fetch(`${config.SAFLE_TOKEN_API}/latest-price?coin=${nativeTokenName}`).then(e=>e.json());
            const rate = res.data?.data[ nativeTokenName.toUpperCase() ]?.quote?.USD?.price;
            
            const priceUSD = isNaN( rate )? 0 : rate;
            
            return formatXDecimals( parseFloat( balance ) * parseFloat( priceUSD ), 3 );
        } catch( e ){
            
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
        const eth_node = blockchainInfo[ activeChain.chainId ].rpcURL;

        try {    
            let response;

            if( eth_node.indexOf('polygon') != -1 ){
                const url = config.gasFeeApiPolygon;
                let resp = await this.getRequest( { url} );

                if( !resp ){
                    
                    const backup = await this.getRequest({ url: config.backupGasFeeApiPolygon });

                    resp = {
                        fastest: parseFloat( backup.result.FastGasPrice ), 
                        standard: parseFloat( backup.result.ProposeGasPrice ), 
                        safeLow: parseFloat( backup.result.SafeGasPrice )                 
                    }
                }

                response = {
                    estimatedBaseFee: 0,
                    high: {
                        maxWaitTimeEstimate: 10*1000,
                        minWaitTimeEstimate: 5*1000,
                        suggestedMaxFeePerGas: resp.fastest,
                        suggestedMaxPriorityFeePerGas: resp.fastest
                        
                    },
                    medium: {
                        maxWaitTimeEstimate: 30*1000,
                        minWaitTimeEstimate: 10*1000,
                        suggestedMaxFeePerGas: resp.standard,
                        suggestedMaxPriorityFeePerGas: resp.standard
                    }, 
                    low: {
                        maxWaitTimeEstimate: 60*1000,
                        minWaitTimeEstimate: 30*1000,
                        suggestedMaxFeePerGas: resp.safeLow,
                        suggestedMaxPriorityFeePerGas: resp.safeLow
                    }
                };

            } else {
                const chainId = activeChain.chainId;
                const url = config.gasFeeApiEth.replace('#{chainid}', chainId );
                response = await this.getRequest({ url });

                if( !response ){
                    const backup = await this.getRequest({ url: config.backupGasFeeApiEth });
                    response = {
                        "low": {
                            suggestedMaxPriorityFeePerGas: parseFloat( backup.result.SafeGasPrice ),
                            suggestedMaxFeePerGas: parseFloat( backup.result.SafeGasPrice ),
                            minWaitTimeEstimate: 15000,
                            maxWaitTimeEstimate: 30000
                        },
                        "medium": {
                            suggestedMaxPriorityFeePerGas: parseFloat( backup.result.ProposeGasPrice ),
                            suggestedMaxFeePerGas: parseFloat( backup.result.ProposeGasPrice ),
                            minWaitTimeEstimate: 15000,
                            maxWaitTimeEstimate: 45000
                        },
                        "high": {
                            suggestedMaxPriorityFeePerGas: parseFloat( backup.result.FastGasPrice ),
                            suggestedMaxFeePerGas: parseFloat( backup.result.FastGasPrice ),
                            minWaitTimeEstimate: 15000,
                            maxWaitTimeEstimate: 60000
                        },
                        "estimatedBaseFee": parseFloat( backup.result.suggestBaseFee ),
                    }
                }
            }
            return response;
        } catch( e ){
            
            return null;
        }
    }

    async checkPin( pin ){
        try {
            const v = await this.vault.validatePin( parseInt( pin ) );
            return v.response;
        } catch( e ){
            return false;
        }
    }

    async _createAndSendTransaction( pin ) {
        const chain = this.keylessInstance.getCurrentChain();
        const trans = this.activeTransaction;
        if( !trans ){
            
            return;
        }
        
        
        const rawTx = await this._createRawTransaction( trans );
        rawTx.from = rawTx.from.substr(0, 2)+ rawTx.from.substr(-40).toLowerCase();
        rawTx.to = rawTx.to.substr(0, 2)+ rawTx.to.substr(-40).toLowerCase();
        
        const state = Storage.getState();
        const decKey = state.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
        this.vault.restoreKeyringState( state.vault, pin, decKey );

        const chainName = chain.chain.rpcURL.indexOf('polygon') != -1? 'polygon' : 'ethereum';

        try {
            const signedTx = await this._signTransaction( rawTx, pin, chain.chainId );
            

            const tx = this.web3.eth.sendSignedTransaction( signedTx );
        
            tx.once('transactionHash', ( hash ) => {
                
                this.transactionHashes.push( hash );
                this.keylessInstance._showUI('txnSuccess');

            });
            const sub = tx.once('receipt', ( err, txnReceipt ) => {
                
                this._lastReceipt = txnReceipt; 

                if( txnReceipt.status == 1 ){
                    this.keylessInstance.provider.emit('transactionSuccess', { receipt: txnReceipt } );
                } else {
                    this.keylessInstance._showUI('txnFailed'); 
                    this.keylessInstance.provider.emit('transactionFailed', { receipt: txnReceipt } );
                }
            });
            tx.on('confirmation', ( confNr, receipt ) => {
                
                tx.off('receipt');
                tx.off('confirmation');
                this.keylessInstance.provider.emit('transactionComplete', { receipt: txnReceipt } );
            });
            tx.then( receipt => {
               this.keylessInstance.provider.emit('transactionSuccess', { receipt } );
            }).catch( err => { 
                Storage.saveState( { lastError: err.message } );
                this.keylessInstance._showUI('txnFailed');
                this.keylessInstance.provider.emit('transactionFailed', { receipt: err.message });
            });
        } catch ( e ){
            Storage.saveState( { lastError: e.message } );
            this.keylessInstance._showUI('txnFailed');

            
        }

        return false;
    }

    async _signTransaction( rawTx, pin, chainId ){

        let signedTx, chainName, signed, decKey;
        let state = {};
        switch( blockchainInfo[ chainId ].chain_name ){
            case 'ethereum':
                chainName = blockchainInfo[ chainId ].chain_name;
                this.vault.changeNetwork( chainName );

                const mstate = Storage.getState();

                const mdecKey = mstate.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
                await this.vault.restoreKeyringState( mstate.vault, parseInt( pin ), mdecKey );

                rawTx.from = rawTx.from.substr(0, 2)+ rawTx.from.substr(-40).toLowerCase();

                

                signed = await this.vault.signTransaction( rawTx, pin, this.getNodeURI( chainId ) );
                

                return signed.response;
            break;

            case 'polygon':
                
                const someState = Storage.getState();

                chainName = blockchainInfo[ chainId ].chain_name;
                this.vault.changeNetwork( chainName );
                
                

                const pdecKey = someState.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
                await this.vault.restoreKeyringState( someState.vault, parseInt( pin ), pdecKey );

                rawTx.from = rawTx.from.substr(0, 2)+ rawTx.from.substr(-40).toLowerCase();

                

                signed = await this.vault.signTransaction( rawTx, pin, this.getNodeURI( chainId ) );
                

                return signed.response;
                return {};
            break;

            case 'mumbai':
                const state = Storage.getState();
                const decKey = state.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
                await this.vault.restoreKeyringState( state.vault, parseInt( pin ), decKey );
                
                const acc = await this.vault.getAccounts( decKey );
                const addr = rawTx.from.substr(0, 2)+ rawTx.from.substr(-40).toLowerCase();

                

                const privateKey = (await this.vault.exportPrivateKey( addr, parseInt( pin ) )).response;
                

                const customChainParams = { name: 'matic-mumbai', chainId: 80001, networkId: 80001 }
                const common = Common.forCustomChain('goerli', customChainParams );
                const tx = Transaction.fromTxData({ ...rawTx, nonce: rawTx.nonce }, { common })
                const pkey = Buffer.from( privateKey, 'hex');

                const signedTransaction = tx.sign( pkey );
                
                const signedTx = bufferToHex(signedTransaction.serialize());
                return signedTx;
            break;

            default: 
                const dstate = Storage.getState();
                const ddecKey = dstate.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
                await this.vault.restoreKeyringState( dstate.vault, parseInt( pin ), ddecKey );

                return (await this.vault.signTransaction( rawTx, pin, this.getNodeURI( chainId ) )).response;
            break;
        }
        
        return signedTx;
    }

    async _createRawTransaction( trans ){
        const chain = this.keylessInstance.getCurrentChain();
        const count = await this.web3.eth.getTransactionCount( trans.data.from );
        

        let config = {};

        switch( blockchainInfo[ chain.chainId ].chain_name ){
            case 'ethereum':
                config = {
                    to: trans.data.to,
                    from: trans.data.from,
                    value: trans.data.value,
                    gasLimit: this.web3.utils.numberToHex( trans.data.gasLimit ),
                    maxFeePerGas: this.web3.utils.numberToHex( this.web3.utils.toWei( parseFloat( trans.data.maxFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    maxPriorityFeePerGas: this.web3.utils.numberToHex( this.web3.utils.toWei( parseFloat( trans.data.maxPriorityFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    nonce: count
                }
            break;

            case 'polygon':
                config = {
                    to: trans.data.to,
                    from: trans.data.from,
                    value: trans.data.value,
                    gasLimit: this.web3.utils.numberToHex( trans.data.gasLimit ),
                    maxFeePerGas: this.web3.utils.numberToHex( this.web3.utils.toWei( parseFloat( trans.data.maxFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    maxPriorityFeePerGas: this.web3.utils.numberToHex( this.web3.utils.toWei( parseFloat( trans.data.maxPriorityFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    nonce: count,
                    type: '0x2',
                    chainId: chain.chainId
                }
            break;

            case 'ropsten':
                config = {
                    to: trans.data.to,
                    from: trans.data.from,
                    value: trans.data.value,
                    gasLimit: this.web3.utils.numberToHex( trans.data.gasLimit ),
                    maxFeePerGas: this.web3.utils.numberToHex( this.web3.utils.toWei( parseFloat( trans.data.maxFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    maxPriorityFeePerGas: this.web3.utils.numberToHex( this.web3.utils.toWei( parseFloat( trans.data.maxPriorityFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    nonce: count
                }
            break;

            case 'mumbai':
                config = {
                    to: trans.data.to,
                    from: trans.data.from,
                    value: trans.data.value.indexOf('0x') != -1? trans.data.value : this.web3.utils.toWei( trans.data.value.toString(), 'ether'),
                    gasLimit: this.web3.utils.numberToHex( 40000 ),
                    gasPrice: this.web3.utils.toHex( this.web3.utils.toWei( parseFloat( trans.data.maxFeePerGas ).toFixed(2).toString(), 'gwei') ),
                    nonce: count,
                    chainId: chain.chainId
                }
                
            break;
        }
        return config;
    }

    getActiveChainExplorer(){
        const chain = this.keylessInstance.getCurrentChain();
        return blockchainInfo[ chain.chainId ].explorer;
    }

    async _signMessage( pin ){
        if( this.activeSignRequest ){
            const state = Storage.getState();
            const rpcUrl = this.getNodeURI( this.keylessInstance.getCurrentChain().chainId );
            

            try {
                const decKey = state.decriptionKey.reduce( ( acc, el, idx ) => { acc[idx]=el;return acc;}, {} );
                await this.vault.restoreKeyringState( state.vault, pin, decKey );
                
                
                const acc = await this.vault.exportPrivateKey( this.activeSignRequest.address.toString(), parseInt( pin ) );            
            
                const trans = await this.vault.sign( this.activeSignRequest.data, this.activeSignRequest.address.toString(), parseInt( pin ), rpcUrl );
                if( trans.hasOwnProperty('error') ){
                    this.activeSignRequest.reject( {
                        message: trans.error,
                        code: 4200,
                        method: 'Sign Message'
                    } );
                } else {
                    this.activeSignRequest.resolve( trans.response );
                }
                this.keylessInstance._hideUI();
                

                return trans?.response;
            } catch( e ){
                this.activeSignRequest.reject( {
                    message: e,
                    code: 4200,
                    method: 'Sign Message'
                } );
                this.keylessInstance._hideUI();
                return false;
            }
            
        }
    }

    async getSafleIdFromAddress( address ){
        const node_uri = await this.getNodeURI( this.keylessInstance.getCurrentChain().chainId );
        const safleId = new safleIdentity( this.keylessInstance._env == 'dev'? 'testnet' : 'mainnet', node_uri );
        try {
            const safleID = await safleId.getSafleId( address );
            
            return safleID.indexOf('Invalid') != -1? false : safleID;
        } catch( e ){
            
            return false;
        }
    }

    clearActiveTransaction(){
        this.activeTransaction = null;
        this.activeSignRequest = null;
    }




    async getRequest( { url } ){
        const resp = await fetch( url ).then( e => e.json() ).catch( e => {
            
            return null;
        });
        return resp;
    }

    _setLoading( flag ){
        const inst = this.keylessInstance._activeScreen;
        if( inst && inst.hasOwnProperty('el') ){
            flag? inst.el.classList.add('loading') : inst.el.classList.remove('loading')
        }
    }

    _setBlockchainRPC( config ){
        for( var i in blockchainInfo ){
            const curr = config.find( e => e.chainId == i );
            if( curr ){
                blockchainInfo[ i ].rpcURL = curr.rpcURL;
            }
        }
    }

    async _getIsVaultMobile( user ){
        let res = await fetch(`${config.AUTH_URL}/auth/safleid-status/${user}`).then(e=>e.json());
        if( res.statusCode !== 200 ){
            return null;
        }
        return res.data?.vaultStorage?.mobile == true;
    }

    _sanitizeTransaction( config ){
        try {
            const allowedParams = ['from', 'to', 'value', 'gas', 'gasPrice', 'nonce', 'maxPriorityFeePerGas', 'maxFeePerGas', 'data', 'type', 'chainId'];
            let illegalAttr = false;
            for( var i in config ){
                if( allowedParams.indexOf( i ) == -1 ){
                    illegalAttr = i;
                };
            }
            if( illegalAttr ){
                throw new Error(`Invalid transaction attribute "${illegalAttr}"`);
            }
            return config;
        } catch ( e ){
            console.error( e.message );
            return false;
        }
    }

    async loadTokenData() {
        const tokenData = await fetch( config.assets ).then( e => e.json() );
        this.tokenData = tokenData;
    }

    getTokenIcon( token ){
        const addr = token.tokenAddress;
        const chain = blockchainInfo[ this.keylessInstance.getCurrentChain()?.chainId ].chain_name;

        if( Object.values( this.tokenData ).length == 0 ){
            return null;
        }

        const found = this.tokenData.chains.hasOwnProperty( chain ) && this.tokenData.chains[chain].CONTRACT_MAP.hasOwnProperty( addr )? this.tokenData.chains[chain].CONTRACT_MAP[ addr ].logo : null;
        return found;
    }
}

export default KeylessController;