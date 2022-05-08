import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import tokenIcon from './../images/token-icon.webp'
import popoutImg from './../images/pop-out.svg'
import ethIcon from './../images/eth-icon.svg'
import copyIcon from './../images/copy-icon.svg'
import UIScreen from '../classes/UIScreen';
import {copyToClipboard, middleEllipsis} from '../helpers/helpers';
import ConfirmationDialog from '../classes/ConfirmationDialog';

class DashboardScreen extends UIScreen {
    connectionStatus = false;
    activeWalletAddress = ''; // string
    activeWalletBalance = 0; // number
    activeWalletUSDBalance = 0; // number
    

    // Retrive dashboard data for UI
    async populateData() {
        this.keyless.kctrl._setLoading(true);

        this.connectionStatus = this.keyless.isConnected(); // Check connectivity status
        this.activeWalletAddress = this.keyless.kctrl.getAccounts()?.address; // Extract selected address
        this.activeWalletBalance = await this.keyless.kctrl.getWalletBalance(this.activeWalletAddress);
        this.activeWalletUSDBalance = await this.keyless.kctrl.getBalanceInUSD(this.activeWalletBalance);
        
        // Define html elems
        this.activeBalanceEl = this.el.querySelector('#active-balance');
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
        this.activeBalanceEl.value = this.activeWalletBalance || 0;
        this.el.querySelector('#active-wallet-tooltip span').innerHTML = this.activeWalletAddress;
        
        // Define html elems
        this.setHTML('#connection-status', this._renderConnectionEl());
        this.setHTML('#active-wallet', middleEllipsis(this.activeWalletAddress, 4));
        this.setHTML('#active-balance', this.activeWalletBalance || 0);
        this.setHTML('#active-usd-balance', this.activeWalletUSDBalance || 0);
        this.setHTML('#active-wallet-tooltip span', this.activeWalletAddress);
        this.setHTML('#sign-message', this.keyless.kctrl.getSignRequestData() );

        this.keyless.kctrl._setLoading(false);
    }

    // Reject Transaction (reject btn action)
    rejectConfirmCallback = () => {
        clearInterval( this.feeTm );

        this.keyless.kctrl.activeSignRequest.reject( {
            message: 'User rejected the transaction',
            code: 4200,
            method: 'User rejected'
        });
        this.keyless._hideUI();
    }

    async onShow() {
        // on show > first retrieve data
        await this.populateData();
        
        // on close
        this.el.querySelector('.close').addEventListener('click', ( e ) => {
            e.preventDefault();
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this transaction?`, 
                `Accept`, 
                this.rejectConfirmCallback
            );
        });

        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('copied to clipboard... ', this.activeWalletAddress);
            copyToClipboard(this.activeWalletAddress);
        });

        this.el.querySelector('.reject_btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Show reject confirmation modal
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this transaction?`, 
                `Accept`, 
                this.rejectConfirmCallback
            );
        });
        this.el.querySelector('.confirm_btn').addEventListener('click', ( e ) => {
            e.preventDefault();
            this.keyless._showUI('pin');
        });

        // open wallet 
        this.el.querySelector('.btn_open_webapp').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('open wallet');
        });
        
    }

    _renderConnectionEl () {
        let statusClass = 'disconnected';
        let statusLabel = 'Not Connected';
        let statusDomain = 'Not Connected to any dApp';

        if (this.connectionStatus) {
            statusClass = 'connected';
            statusLabel = 'Connected';
        }

        return (`
            <div class="${statusClass}">
                ${statusLabel}
            </div>
            <div class="hover-info--1">
                <div class="hover-info--1__triangle"></div>
            ${statusDomain}
            </div>
        `);
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
                <h3 class="header_title">Sign Transaction</h3>
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
                    <img src="${ethIcon}" alt="ETH Icon">
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

export default DashboardScreen;