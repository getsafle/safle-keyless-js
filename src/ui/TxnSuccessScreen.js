import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import successIconImg from './../images/success-icon.svg';
import copyIcon from './../images/copy-icon.svg';

import UIScreen from '../classes/UIScreen';
import ConnectedStatus from './components/ConnectedStatus';
import { copyToClipboard, middleEllipsisMax } from '../helpers/helpers';


class TxnSuccessScreen extends UIScreen {
    lastHash = '';
    explorerName = 'Etherscan';

    clearTransaction(){
        this.keyless.kctrl.clearActiveTransaction();
    }
    onShow(){
        this.el.querySelector('.close').addEventListener('click', () => {
            this.clearTransaction();
            this.keyless._hideUI();
        });


        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            e.target.disabled = true;
            
            copyToClipboard( this.lastHash );
        });

        this.el.querySelector('.txn-success-ok-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.target.disabled = true;
            this.clearTransaction();
            this.keyless.openDashboard();
        });

        this.el.querySelector('.logo').addEventListener('click', (e) => {
            e.preventDefault();
            
        });
        
        this.el.querySelector('.safle_link').addEventListener('click', (e) => {
            e.preventDefault();
        });

        this.populateData();
    }

    populateData(){
        this.lastHash = this.keyless.kctrl.transactionHashes.pop();
        const explorer = this.keyless.kctrl.getActiveChainExplorer();
        this.explorerName = explorer.split('.').slice(-2,-1).join('').split('//').pop();
        this.el.querySelector('.etherscan_link').innerText = this.explorerName;

        this.el.querySelector('.etherscan_link').setAttribute('href', explorer + this.lastHash );
        this.el.querySelector('.copy-address h3').innerHTML = '<span>Txn#:</span> '+ middleEllipsisMax( this.lastHash, 8 );

        this.connectionStatus = this.keyless.isConnected();
        const connectionEl = this.el.querySelector('#connection-status');
        const connStatusEl = new ConnectedStatus(connectionEl, this.connectionStatus);
    }

    render(){
        

        return `<div class="txn">

        <img class="close" src="${closeImg}" alt="Close Icon">
        
        <div id="connection-status"></div>

        <a class="logo" href="#">
            <img src="${logoImg}" alt="Safle Logo">
        </a>

        <div class="txn__body">

            <img src="${successIconImg}" alt="Success Icon">
            <h3>Transaction signed & sent successfully</h3>
            <h5>Transaction signed & sent successfully, your transaction is sent to the blockchain and is being mined. Click below to view in real time.</h5>
            <h4>Check your transaction on</h4>
            <a href="#" target="_blank" class='etherscan_link'></a>

        </div>

        <div class="txn__footer">

            <div class="copy-address">
                <h3><span>Txn#:</span></h3>
                <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
            </div>
            <button class="btn__tp--1 txn-success-ok-btn">GO TO DASHBOARD</button>
            <div class="powered-by">
                <h4>powered by</h4>
                <a href="#" class="safle_link" ><img src="${logoImg}" alt="Safle Logo"></a>
            </div>

        </div>

    </div>`
    }

}

export default TxnSuccessScreen;