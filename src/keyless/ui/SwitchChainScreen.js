import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
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
import UIScreen from '../classes/UIScreen';
import Dropdown from '../classes/DropDown';
import AddressDropdown from '../classes/AddressDropdown';

class SwitchChainScreen extends UIScreen {
    chosenAddress = false;

    async onShow(){
        const currWallet = this.keyless.kctrl.getAccounts();
        this.chosenAddress = currWallet.address;
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            console.log( this.chosenAddress );
            this.keyless.setNetworkAndLogin( this.chosenAddress );
            this.keyless._hideUI();
        });

        const chains = this.keyless.kctrl.getChainsOptions( this.keyless.allowedChains );
        let addreses = await this.keyless.kctrl.getAddressesOptions( this.keyless.kctrl.wallets );
        this.chosenAddress = this.keyless.kctrl.wallets[ 0 ];

        this.mount = this.el.querySelector('#mount_dropdowns');
        this.mount.innerHTML = '';

        this.dropdown1 = new Dropdown( this.mount, 'dropdown__tp--1', 'dropdown__content--1', chains );
        this.dropdown2 = new AddressDropdown( this.mount, 'dropdown__tp--1', 'dropdown__content--2', addreses, this.keyless.getCurrentNativeToken() );

        this.dropdown1.onChange( async ( idx, option ) => {
            this.keyless.switchNetwork( option.chainId );

            addreses = await this.keyless.kctrl.getAddressesOptions( this.keyless.kctrl.wallets );
            this.dropdown2.setOptions( addreses );
        });

        this.dropdown2.onChange( ( idx, wallet ) => {
            this.keyless.switchWallet( idx );
            this.chosenAddress = this.keyless.kctrl.wallets[ idx ];
            console.log( this.chosenAddress );
        });

        this.el.querySelector('#proceed_btn').addEventListener('click', () => {
            this.keyless._hideUI();
            this.keyless.setNetworkAndLogin( 0 );
        });
    }

    hideDropdowns(){
        Array.from( document.querySelectorAll('.dropdown__content--1,.dropdown__content--2') ).forEach( ( el ) => {
            el.classList.add('d--none');
        });
    }

    render(){

        return `<div class="chain">

        <img class="close" src="${closeImg}" alt="Close Icon">

        <a class="logo" href="#">
            <img src="${logoImg}" alt="Safle Logo">
        </a>

        <div id="mount_dropdowns"></div>

        <button class="btn__tp--1" id="proceed_btn">Proceed</button>
        <button class="btn__tp--2 c--gray">
            Open Wallet
            <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
        </button>

    </div>`
    }

}

export default SwitchChainScreen;