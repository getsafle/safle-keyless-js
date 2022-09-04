import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import networkImg from './../images/network-icon.svg';
// import network2 from './../images/network-2.svg'
// import network3 from './../images/network-3.svg'
// import network4 from './../images/network-4.svg'
// import network5 from './../images/network-5.svg'
// import network6 from './../images/network-6.svg'
import tokenIcon from './../images/token-icon.webp'
// import user2 from './../images/user-2.webp'
// import user3 from './../images/user-3.webp'
// import user4 from './../images/user-4.webp'
import popoutImg from './../images/pop-out.svg'
import gearImg from '../images/gear.svg'
import ethIcon from './../images/eth-icon.svg'
import copyIcon from './../images/copy-icon.svg'
import UIScreen from '../classes/UIScreen';
import {copyToClipboard, middleEllipsis, kl_log, formatMoney } from '../helpers/helpers';
import blockchainInfo from '../helpers/blockchains';
import ConnectedStatus from './components/ConnectedStatus';

class DashboardScreen extends UIScreen {
    connectionStatus;
    activeChain = '';
    activeChainUrl = '';
    activeWalletAddress = ''; // string
    activeWalletBalance = 0; // number
    activeWalletUSDBalance = 0; // number
    chainIcon = '';

    // Retrive dashboard data for UI
    async populateData() {
        let tokenHtmlList = '';
        const activeChainId = this.keyless.getCurrentChain().chainId;
        this.keyless.kctrl._setLoading(true);

        this.connectionStatus = this.keyless.isConnected(); // Check connectivity status
        this.activeChain = blockchainInfo[activeChainId] || 'no known active chain';
        this.activeChainUrl = this.activeChain?.rpcURL;
        this.activeWalletAddress = this.keyless.kctrl.getAccounts()?.address; // Extract selected address
        this.activeWalletBalance = await this.keyless.kctrl.getWalletBalance(this.activeWalletAddress, true, 5);
        this.activeWalletUSDBalance = formatMoney(await this.keyless.kctrl.getBalanceInUSD(this.activeWalletBalance));
        
        // Define html elems
        const connectionEl = this.el.querySelector('#connection-status');
        this.activeAddressEl = this.el.querySelector('#active-wallet');
        this.activeBalanceEl = this.el.querySelector('#active-balance');
        this.tokenListEl = this.el.querySelector('#token-list');
        this.chainIconEl = this.el.querySelector('#chain_icon');
        const chainName = this.activeChain.chain_name;
        this.chainIconEl.src = ( chainName == 'ethereum'|| chainName == 'ropsten')? 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' : 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png';

        // Update connection status
        const connStatusEl = new ConnectedStatus(connectionEl, this.connectionStatus);

        // Attribute values to html elems
        this.activeBalanceEl.value = this.activeWalletBalance || 0;
        this.el.querySelector('#active-wallet-tooltip span').innerHTML = this.activeWalletAddress;

        await this.keyless.kctrl.getTokens().then( tokensData => {
            kl_log( 'tokens', tokensData );
            if (!tokensData.hasOwnProperty('error') && tokensData.length ) {
                tokensData.forEach( ( token ) => {
                    const {symbol, balance, decimal} = token;
                    // kl_log( 'this?', this._renderTokenEl );
                    const tokenIcon = this.keyless.kctrl.getTokenIcon( token );
                    tokenHtmlList += this._renderTokenEl(symbol, balance, decimal, tokenIcon );
                })
            } else {
                tokenHtmlList = (`<div class="message">No tokens available on this wallet.</div>`);
            }
        });
        
        // Define html elems
        // this.setHTML('#connection-status', this._renderConnectionEl());
        this.setHTML('#active-chain', this.activeChain.name);
        this.setHTML('#active-wallet', middleEllipsis(this.activeWalletAddress, 7));
        this.setHTML('#active-balance', this.activeWalletBalance || 0);
        this.setHTML('#active-usd-balance', this.activeWalletUSDBalance || 0);
        this.setHTML('#active-wallet-tooltip span', this.activeWalletAddress);

        // kl_log( 'token cont', tokenHtmlList );
        this.setHTML('#token-list', tokenHtmlList );

        this.keyless.kctrl._setLoading(false);
    }

    async onShow() {
       
        
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });

        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            kl_log('copied to clipboard... ', this.activeWalletAddress);
            copyToClipboard(this.activeWalletAddress);
        });

        // select network
        this.el.querySelector('.dashboard__network').addEventListener('click', (e) => {
            e.preventDefault();
            kl_log('change network');
            // this.keyless._hideUI();
            this.keyless.selectChain();
        });
        

        // select address / change
        this.el.querySelector('.change_wallet').addEventListener('click', (e) => {
            e.preventDefault();
            kl_log('change address');
            // this.keyless._hideUI();
            this.keyless.selectChain();
        });

        // open wallet 
        this.el.querySelector('.btn_open_webapp').addEventListener('click', (e) => {
            e.preventDefault();
            window.open( process.env.OPEN_WALLET_LINK, '_blank' );
            kl_log('open wallet');
            // this.keyless._hideUI();
            // this.keyless.selectChain();
        });
        
        // on show > first retrieve data
        await this.populateData();
    }

    _renderTokenEl(symbol, balance, decimal, icon = null ) {
        const tokenBalance = balance / Number('1e'+decimal); // calculate 
        return (`
        <div>
            <div>
                <img src="${ icon || tokenIcon}" alt="Network Icon">
                <h3 class='token_prefix'>${symbol}</h3>
            </div>
            <div>
                <h3>${ parseFloat(tokenBalance).toFixed(4)}</h3>
            </div>
        </div>
    `)
    }

    render() {
        return (`
        <div class="dashboard">
        
            <div class="dashboard__header with__border">
                <img class="close" src="${closeImg}" alt="Close Icon">
                <div id="connection-status"></div>
                <a class="logo" href="#">
                    <img src="${logoImg}" alt="Safle Logo">
                </a>
                <div class="dashboard__network">
                    <img src="${networkImg}" alt="Network Icon">
                    <h3 id="active-chain"></h3>
                </div>
            </div>    
            
            <div class="dashboard__body">
                <div class="h4">Wallet Address</div>
                <div class="dashboard__wallet">
                    <div class="copy-address">
                        <img src="${tokenIcon}" alt="Token Icon">
                        <h3 id="active-wallet"></h3>
                        <div id="active-wallet-tooltip" class="hover-info--1">
                            <div class="hover-info--1__triangle"></div>
                            <span></span>
                        </div>
                        <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
                    </div>
                    <button class="btn__tp--3 change_wallet">
                        <img src="${gearImg}" alt="Gear Icon">
                        <div>Change</div>
                    </button>
                </div>

                <div class="h4">Balance</div>
                <div class="dashboard__balance"> 
                    <img src="https://assets.coingecko.com/coins/images/279/large/ethereum.png" alt="ETH Icon" id="chain_icon">
                    <div>
                        <div id="active-balance" class="input"></div>
                        <h3>\$
                            <span id="active-usd-balance"></span>
                        </h3>
                    </div>
                </div>

                <div class="h4">Token Balances</div>
                <div id="token-list" class="dropdown__content dropdown__content--3"></div>
        
                <button class="btn__tp--2 c--gray btn_open_webapp">
                    Open Wallet
                    <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
                </button>
            
            </div>

        </div>`)
    }

}

export default DashboardScreen;