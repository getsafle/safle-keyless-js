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

class SwitchChainScreen {

    onShow(){
        console.log('onshow')
        document.querySelector('.dropdown1').addEventListener('click', () => {
            console.log('click');
            document.querySelector('.dropdown__content--1').classList.toggle('d--none');
        });
        document.querySelector('.dropdown2').addEventListener('click', () => {
            console.log('click');
            document.querySelector('.dropdown__content--2').classList.toggle('d--none');
        });
    }

    render(){
        setTimeout( this.onShow, 150 );

        return `<div class="chain">

        <img class="close" src="${closeImg}" alt="Close Icon">

        <a class="logo" href="#">
            <img src="${logoImg}" alt="Safle Logo">
        </a>

        <div class="dropdown__tp--1 dropdown1">
            <div>
                <img src="${networkImg}" alt="Network Icon">
                <h3>Ethereum Mainnet</h3>
            </div>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="svg-inline--fa fa-angle-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
        </div>
        <div class="dropdown__content dropdown__content--1 d--none">
            <div>
                <img src="${networkImg}" alt="Network Icon">
                <h3>Ropsten Test Network</h3>
            </div>
            <div>
                <img src="${network2}" alt="Network Icon">
                <h3>Ropsten Test Network</h3>
            </div>
            <div>
                <img src="${network3}" alt="Network Icon">
                <h3>Ethereum Mainnet</h3>
            </div>
            <div>
                <img src="${network4}" alt="Network Icon">
                <h3>Ethereum Mainnet</h3>
            </div>
            <div>
                <img src="${network5}" alt="Network Icon">
                <h3>Ethereum Mainnet</h3>
            </div>
            <div>
                <img src="${network6}" alt="Network Icon">
                <h3>Ethereum Mainnet</h3>
            </div>
        </div>

        <div class="dropdown__tp--1 dropdown2">
            <div>
                <img src="${tokenIcon}" alt="Accout Icon">
                <h3>0x17...3d9</h3>
            </div>
            <div>
                <h3>3.0120 <span class="c--dark">ETH</span></h3>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="svg-inline--fa fa-angle-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
            </div>
        </div>
        <div class="dropdown__content dropdown__content--2 d--none">
            <div>
                <div>
                    <img src="${tokenIcon}" alt="Network Icon">
                    <h3>0x17...3d9</h3>
                </div>
                <div>
                    <h3>3.0120 <span class="c--dark">ETH</span></h3>
                </div>
            </div>
            <div>
                <div>
                    <img src="${tokenIcon}" alt="Network Icon">
                    <h3>0x17...3d9</h3>
                </div>
                <div>
                    <h3>3.0120 <span class="c--dark">ETH</span></h3>
                </div>
            </div>
            <div>
                <div>
                    <img src="${tokenIcon}" alt="Network Icon">
                    <h3>0x17...3d9</h3>
                </div>
                <div>
                    <h3>3.0120 <span class="c--dark">ETH</span></h3>
                </div>
            </div>
            <div>
                <div>
                    <img src="${user2}" alt="Network Icon">
                    <h3>0x17...3d9</h3>
                </div>
                <div>
                    <h3>3.0120 <span class="c--dark">ETH</span></h3>
                </div>
            </div>
            <div>
                <div>
                    <img src="${user3}" alt="Network Icon">
                    <h3>0x17...3d9</h3>
                </div>
                <div>
                    <h3>3.0120 <span class="c--dark">ETH</span></h3>
                </div>
            </div>
            <div>
                <div>
                    <img src="${user4}" alt="Network Icon">
                    <h3>0x17...3d9</h3>
                </div>
                <div>
                    <h3>3.0120 <span class="c--dark">ETH</span></h3>
                </div>
            </div>
        </div>

        <button class="btn__tp--1" id="proceed_btn">Proceed</button>
        <button class="btn__tp--2 c--gray">
            Open Wallet
            <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
        </button>

    </div>`
    }

}

export default SwitchChainScreen;