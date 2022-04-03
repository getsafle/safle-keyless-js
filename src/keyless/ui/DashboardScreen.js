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
import {copyToClipboard} from '../helpers/helpers';


class DashboardScreen extends UIScreen {

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

        //show tokens
        this.keyless.kctrl.getTokens().then( resp => console.log( resp ) );
        
    }

    render(){

        return `<div class="dashboard">
        
        <div class="dashboard__header">

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
                    <h3 class="from_to_clipboard">0x10e7…203d9</h3>
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
                    <input type="number" value="3.0120" readonly>
                    <h3>$11469.43</h3>
                </div>
            </div>

            <div class="h4">Token Balances</div>
            <div class="dropdown__content dropdown__content--3">
                <div>
                    <div>
                        <img src="${tokenIcon}" alt="Network Icon">
                        <h3 class='token_prefix'>Matic</h3>
                    </div>
                    <div>
                        <h3>3.0120</h3>
                    </div>
                </div>
                <div>
                    <div>
                        <img src="${user2}" alt="Network Icon">
                        <h3 class='token_prefix'>Luna</h3>
                    </div>
                    <div>
                        <h3>3.0120</h3>
                    </div>
                </div>
                <div>
                    <div>
                        <img src="${user3}" alt="Network Icon">
                        <h3 class='token_prefix'>BNB</h3>
                    </div>
                    <div>
                        <h3>3.0120</h3>
                    </div>
                </div>
                <div>
                    <div>
                        <img src="${user4}" alt="Network Icon">
                        <h3 class='token_prefix'>USDT</h3>
                    </div>
                    <div>
                        <h3>3.0120</h3>
                    </div>
                </div>
            </div>
    
            <button class="btn__tp--2 c--gray btn_open_webapp">
                Open Wallet
                <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
            </button>
        
        </div>

    </div>`
    }

}

export default DashboardScreen;