import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import networkImg from './../images/network-icon.svg';
import tokenIcon from './../images/token-icon.webp'
import popoutImg from './../images/pop-out.svg'
import gearImg from '../images/gear.svg'
import ethIcon from './../images/eth-icon.svg'
import copyIcon from './../images/copy-icon.svg'
import UIScreen from '../classes/UIScreen';
import { copyToClipboard, middleEllipsis, formatMoney } from '../helpers/helpers';
import blockchainInfo from '../helpers/blockchains';
import ConnectedStatus from './components/ConnectedStatus';
import config from './../config/config';

class DashboardScreen extends UIScreen {
    connectionStatus;
    activeChain = '';
    activeChainUrl = '';
    activeWalletAddress = '';
    activeWalletBalance = 0;
    activeWalletUSDBalance = 0;
    chainIcon = '';

    async populateData() {
        let tokenHtmlList = '';
        const activeChainId = this.keyless.getCurrentChain().chainId;
        this.keyless.kctrl._setLoading(true);

        this.connectionStatus = this.keyless.isConnected();
        this.activeChain = blockchainInfo[activeChainId] || 'no known active chain';
        this.activeChainUrl = this.activeChain?.rpcURL;
        this.activeWalletAddress = this.keyless.kctrl.getAccounts()?.address;
        this.activeWalletBalance = await this.keyless.kctrl.getWalletBalance(this.activeWalletAddress, true, 5);
        this.activeWalletUSDBalance = formatMoney(await this.keyless.kctrl.getBalanceInUSD(this.activeWalletBalance));

        const connectionEl = this.el.querySelector('#connection-status');
        this.activeAddressEl = this.el.querySelector('#active-wallet');
        this.activeBalanceEl = this.el.querySelector('#active-balance');
        this.tokenListEl = this.el.querySelector('#token-list');
        this.chainIconEl = this.el.querySelector('#chain_icon');
        const chainName = this.activeChain.chain_name;
        this.chainIconEl.src = (chainName == 'ethereum' || chainName == 'ropsten') ? this.keyless.kctrl.getTokenIcon('eth') : this.keyless.kctrl.getTokenIcon('matic');

        const connStatusEl = new ConnectedStatus(connectionEl, this.connectionStatus);

        this.activeBalanceEl.value = this.activeWalletBalance || 0;
        this.el.querySelector('#active-wallet-tooltip span').innerHTML = this.activeWalletAddress;

        await this.keyless.kctrl.getTokens().then(tokensData => {

            if (!tokensData.hasOwnProperty('error') && tokensData.length) {
                tokensData.forEach((token) => {
                    const { symbol, balance, decimal } = token;
                    const tokenIcon = this.keyless.kctrl.getTokenIcon(token);
                    tokenHtmlList += this._renderTokenEl(symbol, balance, decimal, tokenIcon);
                })
            } else {
                tokenHtmlList = (`<div class="message">No tokens available on this wallet.</div>`);
            }
        });

        this.setHTML('#active-chain', this.activeChain.name);
        this.setHTML('#active-wallet', middleEllipsis(this.activeWalletAddress, 7));
        this.setHTML('#active-balance', this.activeWalletBalance || 0);
        this.setHTML('#active-usd-balance', this.activeWalletUSDBalance || 0);
        this.setHTML('#active-wallet-tooltip span', this.activeWalletAddress);
        this.setHTML('#token-list', tokenHtmlList);

        this.keyless.kctrl._setLoading(false);
    }

    async onShow() {
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });

        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();

            copyToClipboard(this.activeWalletAddress);
        });

        this.el.querySelector('.dashboard__network').addEventListener('click', (e) => {
            e.preventDefault();
            this.keyless.selectChain();
        });

        this.el.querySelector('.change_wallet').addEventListener('click', (e) => {
            e.preventDefault();

            this.keyless.selectChain();
        });

        this.el.querySelector('.btn_open_webapp').addEventListener('click', (e) => {
            e.preventDefault();
            window.open(config.OPEN_WALLET_LINK, '_blank');

        });
        await this.populateData();
    }

    _renderTokenEl(symbol, balance, decimal, icon = null) {
        const tokenBalance = balance / Number('1e' + decimal);
        return (`
        <div>
            <div>
                <img src="${icon || tokenIcon}" alt="Network Icon">
                <h3 class='token_prefix'>${symbol}</h3>
            </div>
            <div>
                <h3>${parseFloat(tokenBalance).toFixed(Number(decimal) > 8 ? 8 : Number(decimal))}</h3>
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