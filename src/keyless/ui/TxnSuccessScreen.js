import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import successIconImg from './../images/success-icon.svg';
import copyIcon from './../images/copy-icon.svg';

import UIScreen from '../classes/UIScreen';
import {copyToClipboard, middleEllipsisMax } from '../helpers/helpers';


class TxnSuccessScreen extends UIScreen {
    lastHash = '';

    onShow(){
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });


        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('copied to clipboard');
            copyToClipboard( this.lastHash );
        });
        // this.el.querySelector('.etherscan_link').addEventListener('click', (e) => {
        //     e.preventDefault();
        //     console.log('etherscan check');
        // });

        this.el.querySelector('.txn-success-ok-btn').addEventListener('click', (e) => {
            e.preventDefault();
            // console.log('txn success continue');
            this.keyless._hideUI();
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

        this.populateData();
    }

    populateData(){
        this.lastHash = this.keyless.kctrl.transactionHashes.pop();
        const explorer = this.keyless.kctrl.getActiveChainExplorer();

        this.el.querySelector('.etherscan_link').setAttribute('href', explorer + this.lastHash );
        this.el.querySelector('.copy-address h3').innerHTML = '<span>Txn#:</span> '+ middleEllipsisMax( this.lastHash, 8 );
    }

    render(){

        return `<div class="txn">

        <img class="close" src="${closeImg}" alt="Close Icon">
        
        <div class="connected">Connected</div>
        <div class="hover-info--1">
            <div class="hover-info--1__triangle"></div>
            app.uniswap.org
        </div>

        <!-- <div class="disconnected">Not Connected</div>
        <div class="hover-info--1">
            <div class="hover-info--1__triangle"></div>
            Not Connected to any dApp
        </div> -->

        <a class="logo" href="#">
            <img src="${logoImg}" alt="Safle Logo">
        </a>

        <div class="txn__body">

            <img src="${successIconImg}" alt="Success Icon">
            <h3>Transaction signed & sent successfully</h3>
            <h5>Transaction signed & sent successfully, your transaction is sent to the blockchain and is being mined. Click below to view in real time.</h5>
            <h4>Check your transaction on</h4>
            <a href="#" target="_blank" class='etherscan_link'>Etherscan</a>

        </div>

        <div class="txn__footer">

            <div class="copy-address">
                <h3><span>Txn#:</span></h3>
                <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
            </div>
            <button class="btn__tp--1 txn-success-ok-btn">Click Ok to Continue</button>
            <div class="powered-by">
                <h4>powered by</h4>
                <a href="#" class="safle_link" ><img src="${logoImg}" alt="Safle Logo"></a>
            </div>

        </div>

    </div>`
    }

}

export default TxnSuccessScreen;