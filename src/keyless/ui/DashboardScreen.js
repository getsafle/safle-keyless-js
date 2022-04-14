import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import networkImg from './../images/network-icon.svg';
import network2 from './../images/network-2.svg'
import network3 from './../images/network-3.svg'
import network4 from './../images/network-4.svg'
import network5 from './../images/network-5.svg'
import network6 from './../images/network-6.svg'
import tokenIcon from './../images/token-icon.webp'
import user2 from './../images/user-2.webp'
import user3 from './../images/user-3.webp'
import user4 from './../images/user-4.webp'
import popoutImg from './../images/pop-out.svg'
import gearImg from '../images/gear.svg'
import ethIcon from './../images/eth-icon.svg'
import copyIcon from './../images/copy-icon.svg'
import UIScreen from '../classes/UIScreen';
import {copyToClipboard, middleEllipsis} from '../helpers/helpers';


class DashboardScreen extends UIScreen {
    connectionStatus = false;
    activeWalletAddress = '';
    activeWalletBalance = '';
    tokens = [];

    activeAddressEl;
    activeBalanceEl;
    connectionEl;

    tokenListEl;

    // Retrive dashboard data for UI
    async populateData() {
        // this.keyless.kctrl._setLoading(true);
        this.connectionStatus = this.keyless.isConnected(); // Check connectivity status
        this.activeWalletAddress = this.keyless.kctrl.getAccounts()?.address; // Extract selected address
        this.activeWalletBalance = await this.keyless.kctrl.getWalletBalance(this.activeWalletAddress);
        
        // Define html elems
        this.activeAddressEl = this.el.querySelector('#active-wallet');
        this.activeBalanceEl = this.el.querySelector('#active-balance');
        this.tokenListEl = this.el.querySelector('#token-list');
        this.connectionEl = this.el.querySelector('#connection-status');

        // Update connection status 
        // @todo to update connection update address url
        this.connectionEl.innerHTML = (`
        <div class="connected">${this.connectionStatus ? 'Connected': 'Not Connected'}</div>
        <div class="hover-info--1">
            <div class="hover-info--1__triangle"></div>
            ${this.connectionStatus ? 'app.uniswap.org' : 'Not Connected to any dApp'}
        </div>`);

        // Attribute values to html elems
        this.activeAddressEl.innerHTML = middleEllipsis(this.activeWalletAddress, 7);
        this.activeBalanceEl.value = this.activeWalletBalance || 0;
        this.el.querySelector('#active-wallet-tooltip span').innerHTML = this.activeWalletAddress;

        await this.keyless.kctrl.getTokens().then( tokensData => {
            console.log( 'tokens', tokensData );
            if (tokensData.length) {
                this.tokenListEl.innerHTML = '';
                tokensData.forEach(({symbol, balance, decimal}) => {
                    const tokenBalance = balance / Number('1e'+decimal); // calculate 
                    console.log('tokineso list ', symbol, tokenBalance, balance, decimal);
                    this.tokenListEl.innerHTML += (`
                        <div>
                            <div>
                                <img src="${tokenIcon}" alt="Network Icon">
                                <h3 class='token_prefix'>${symbol}</h3>
                            </div>
                            <div>
                                <h3>${ parseFloat(tokenBalance).toFixed(4)}</h3>
                            </div>
                        </div>
                    `);
                })
            } else {
                this.tokenListEl.innerHTML = (`<div class="message">No tokens available on this wallet.</div>`);
            }
        });
    }

    async onShow() {
        // on show > first retrieve data
        await this.populateData();
        
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });

        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('copied to clipboard... ', this.activeWalletAddress);
            copyToClipboard(this.activeWalletAddress);
        });

        // select network
        this.el.querySelector('.dashboard__network').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('change network');
            // this.keyless._hideUI();
            this.keyless.selectChain();
        });
        

        // select address / change
        this.el.querySelector('.change_wallet').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('change address');
            // this.keyless._hideUI();
            this.keyless.selectChain();
        });

        // open wallet 
        this.el.querySelector('.btn_open_webapp').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('open wallet');
            // this.keyless._hideUI();
            // this.keyless.selectChain();
        });
        
    }

    render(){

        return `<div class="dashboard">
        
        <div class="dashboard__header">

            <img class="close" src="${closeImg}" alt="Close Icon">

            <div id="connection-status">${this.connectionEl}</div>
    
            <a class="logo" href="#">
                <img src="${logoImg}" alt="Safle Logo">
            </a>

            <div class="dashboard__network">
                <img src="${networkImg}" alt="Network Icon">
                <h3>Ethereum  Mainnet</h3>
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
                <img src="${ethIcon}" alt="ETH Icon">
                <div>
                    <input id="active-balance" type="number" value="" readonly>
                    <h3>$0</h3>
                </div>
            </div>

            <div class="h4">Token Balances</div>
            <div id="token-list" class="dropdown__content dropdown__content--3"></div>
    
            <button class="btn__tp--2 c--gray btn_open_webapp">
                Open Wallet
                <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
            </button>
        
        </div>

    </div>`
    }

}

export default DashboardScreen;