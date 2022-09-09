import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import tokenIcon from './../images/token-icon.webp'
import popoutImg from './../images/pop-out.svg'
import ethIcon from './../images/eth-icon.svg'
import copyIcon from './../images/copy-icon.svg'
import UIScreen from '../classes/UIScreen';
import {copyToClipboard, middleEllipsis, maxChars, formatMoney } from '../helpers/helpers';
import ConfirmationDialog from './components/ConfirmationDialog';
import ConnectedStatus from './components/ConnectedStatus';

class SignScreen extends UIScreen {
    connectionStatus = false;
    activeWalletAddress = '';
    activeWalletBalance = 0;
    activeWalletUSDBalance = 0;
    
    async populateData() {
        this.keyless.kctrl._setLoading(true);

        this.activeWalletAddress = this.keyless.kctrl.getAccounts()?.address;
        this.activeWalletBalance = await this.keyless.kctrl.getWalletBalance( this.activeWalletAddress, true, 5 );
        this.activeWalletUSDBalance = formatMoney( await this.keyless.kctrl.getBalanceInUSD(this.activeWalletBalance) );
        
        this.activeBalanceEl = this.el.querySelector('#active-balance');

        this.connectionStatus = this.keyless.isConnected();
        const connectionEl = this.el.querySelector('#connection-status');
        const connStatusEl = new ConnectedStatus(connectionEl, this.connectionStatus);

        this.activeBalanceEl.value = maxChars( this.activeWalletBalance, 6 ) || 0;
        this.el.querySelector('#active-wallet-tooltip span').innerHTML = this.activeWalletAddress;
        
        this.chainIconEl = this.el.querySelector('#chain_icon');
        this.activeChain = this.keyless.getCurrentChain();
        const chainId = this.activeChain.chainId;
        this.chainIconEl.src = ( chainId == 1 || chainId == 3)? this.keyless.kctrl.getTokenIcon('eth') : this.keyless.kctrl.getTokenIcon('matic');

        this.setHTML('#active-wallet', middleEllipsis(this.activeWalletAddress, 4));
        this.setHTML('#active-balance', maxChars( this.activeWalletBalance, 8 ) || 0);
        this.setHTML('#active-usd-balance', this.activeWalletUSDBalance || 0);
        this.setHTML('#active-wallet-tooltip span', this.activeWalletAddress);
        this.setHTML('#sign-message', this.keyless.kctrl.getSignRequestData() );
        
        this.keyless.kctrl._setLoading(false);
    }

    rejectConfirmCallback = () => {
        clearInterval( this.feeTm );

        this.keyless.kctrl.activeSignRequest.reject( {
            message: 'User rejected the request',
            code: 4200,
            method: 'User rejected'
        });
        this.keyless._hideUI();
    }

    async onShow() {
        await this.populateData();
        
        this.el.querySelector('.close').addEventListener('click', ( e ) => {
            e.preventDefault();
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this request?`, 
                `Accept`, 
                this.rejectConfirmCallback
            );
        });

        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            
            copyToClipboard(this.activeWalletAddress);
        });

        this.el.querySelector('.reject_btn').addEventListener('click', (e) => {
            e.preventDefault();
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this request?`, 
                `Yes`, 
                this.rejectConfirmCallback
            );
        });
        this.el.querySelector('.confirm_btn').addEventListener('click', ( e ) => {
            e.preventDefault();
            e.target.disabled = true;
            this.keyless._showUI('pin');
        });

        this.el.querySelector('.btn_open_webapp').addEventListener('click', (e) => {
            e.preventDefault();
            
        });
        
    }


    render() {
        return (`
        <div class="dashboard">
        
            <div class="dashboard__header">
                <img class="close" src="${closeImg}" alt="Close Icon">
                <div id="connection-status"></div>
                <a class="logo" href="#">
                    <img src="${logoImg}" alt="Safle Logo">
                </a>
                <h3 class="header_title">Sign Message</h3>
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

                <div class="h4">Message</div>
                <textarea id="sign-message" readonly class="sign-message"></textarea>
        
                <button class="btn__tp--1 upper confirm_btn">Sign</button>
                <button class="btn__tp--2 upper reject_btn">Cancel</button>
                <button class="btn__tp--2 c--gray btn_open_webapp">
                    Open Wallet
                    <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
                </button>
            
            </div>

        </div>`)
    }

}

export default SignScreen;