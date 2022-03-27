import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import failedIconImg from './../images/failed-icon.svg';
import copyIcon from './../images/copy-icon.svg';

import UIScreen from '../classes/UIScreen';
import {copyToClipboard} from '../helpers/helpers';



class TxnFailedScreen extends UIScreen {

    onShow(){
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });


        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('copied to clipboard');
            copyToClipboard('0x1deaA720C9Be705D47CB05B30E549CC9b0E5128D');
        });

        this.el.querySelector('.etherscan_link').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('etherscan check');
        });

        this.el.querySelector('.txn-failed-ok-btn').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('txn failed continue');
        });

        this.el.querySelector('.logo').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('logo click');
        });
        
       
        // open wallet 
        this.el.querySelector('.safle_link').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('open external safle link');
        });


        
        
    }

    render(){

        return `<div class="txn">

        <img class="close" src="${closeImg}" alt="Close Icon">
        
        <!-- <div class="connected">Connected</div>
        <div class="hover-info--1">
            <div class="hover-info--1__triangle"></div>
            app.uniswap.org
        </div> -->

        <div class="disconnected">Not Connected</div>
        <div class="hover-info--1">
            <div class="hover-info--1__triangle"></div>
            Not Connected to any dApp
        </div>

        <a class="logo" href="#">
            <img src="${logoImg}" alt="Safle Logo">
        </a>

        <div class="txn__body">

            <img src="${failedIconImg}" alt="Success Icon">
            <h3>Transaction declined</h3>
            <h5 class='mb_20'>Oops! something went wrong. <br> please try again.</h5>
            <h4>Check your transaction on</h4>
            <a href="#" class='etherscan_link'>Etherscan</a>

        </div>

        <div class="txn__footer">

            <div class="copy-address">
                <h3><span>Txn#:</span>0x8f121BE4EC096DAF20aCE4….</h3>
                <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
            </div>
            <button class="btn__tp--1 txn-failed-ok-btn">Click Ok to Continue</button>
            <div class="powered-by">
                <h4>powered by</h4>
                <a href="#" class="safle_link" ><img src="${logoImg}" alt="Safle Logo"></a>
            </div>

        </div>

    </div>`
    }

}

export default TxnFailedScreen;