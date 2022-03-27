import blockchainInfo from './../helpers/blockchains';
import { middleEllipsis } from './../helpers/helpers';
import * as safleHelpers from './../helpers/safleHelpers';

class KeylessController {
    vault = false;
    wallets = [];
    activeWallet = false;
    flowState = 0;

    constructor( keylessInstance ){
        this.keylessInstance = keylessInstance;


    }

    loadVault(){

    }

    async login( user, pass ){
        this._setLoading( true );
        console.log('login with user '+user+', pass '+pass );

        await grecaptcha.execute();
        const token = grecaptcha.getResponse();
        // console.log( token );
        const resp = await safleHelpers.login( user, pass, token );
        if( resp ){
            console.log('success', resp.data.token );
        }
        this._setLoading( false );
              
        //pull wallet from cloud
        this.flowState++;
        // this.keylessInstance._loggedin = true;

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