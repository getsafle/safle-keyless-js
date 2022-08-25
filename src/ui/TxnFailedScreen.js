import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import failedIconImg from './../images/failed-icon.svg';
import copyIcon from './../images/copy-icon.svg';

import UIScreen from '../classes/UIScreen';
import ConnectedStatus from './components/ConnectedStatus';
import { copyToClipboard, middleEllipsisMax } from '../helpers/helpers';
import Storage from '../classes/Storage';


class TxnFailedScreen extends UIScreen {

    onShow(){
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });


        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            
            copyToClipboard('0x1deaA720C9Be705D47CB05B30E549CC9b0E5128D');
        });

        this.el.querySelector('.etherscan_link').addEventListener('click', (e) => {
            e.preventDefault();
            
        });

        this.el.querySelector('.txn-failed-ok-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.keyless._hideUI();
            
        });

        this.el.querySelector('.logo').addEventListener('click', (e) => {
            e.preventDefault();
            
        });
        
        this.el.querySelector('.safle_link').addEventListener('click', (e) => {
            e.preventDefault();
            
        });
        const state = Storage.getState();
        if( state.lastError ){
            this.isError = state.lastError;
        }
        this.populateData();        
    }

    populateData(){
        if( this.isError ){
            this.el.querySelector('.etherscan_link').style.display = 'none';
            this.el.querySelector('.copy-address').style.display = 'none';
            const h4 =this.el.querySelector('.txn__body h4');
            h4.innerHTML = this.isError;
            h4.style.minHeight = '130px';
            h4.style.color = '#f63032';


        } else {
            this.lastHash = this.keyless.kctrl.transactionHashes.pop();
            const explorer = this.keyless.kctrl.getActiveChainExplorer();
    
            this.el.querySelector('.etherscan_link').setAttribute('href', explorer + this.lastHash );
            this.el.querySelector('.copy-address h3').innerHTML = '<span>Txn#:</span> '+ middleEllipsisMax( this.lastHash, 8 );
        }
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

            <img src="${failedIconImg}" alt="Success Icon">
            <h3>Transaction declined</h3>
            <h5 class='mb_20'>Oops! something went wrong. <br> please try again.</h5>
            <h4>Check your transaction on</h4>
            <a href="#" target="_blank" class='etherscan_link'>Etherscan</a>

        </div>

        <div class="txn__footer">

            <div class="copy-address">
                <h3><span>Txn#:</span></h3>
                <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
            </div>
            <button class="btn__tp--1 txn-failed-ok-btn">OK</button>
            <div class="powered-by">
                <h4>powered by</h4>
                <a href="#" class="safle_link" ><img src="${logoImg}" alt="Safle Logo"></a>
            </div>

        </div>

    </div>`
    }

}

export default TxnFailedScreen;