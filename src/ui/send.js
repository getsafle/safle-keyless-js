import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import ethIcon2 from '../images/eth-icon-2.svg';
import user4 from '../images/user-4.webp';
import editPen from '../images/edit-pen.svg';
import popOut from './../images/pop-out.svg';

class SwitchChainScreen {

    onShow(){
        console.log('onshow')
        // document.querySelector('.dropdown1').addEventListener('click', () => {
        //     console.log('click');
        //     document.querySelector('.dropdown__content--1').classList.toggle('d--none');
        // });
        // document.querySelector('.dropdown2').addEventListener('click', () => {
        //     console.log('click');
        //     document.querySelector('.dropdown__content--2').classList.toggle('d--none');
        // });
    }

    render(){
        setTimeout( this.onShow, 150 );

        return `<div class="transaction">

        <div class="transaction__header">
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
        </div>

        <div class="transaction__account">
            <div class="transaction__account__address">
                <img src="src/images/token-icon.webp" alt="Network Icon">
                <h3>0x17...3d9</h3>
                <div class="hover-info--1">
                    <div class="hover-info--1__triangle"></div>
                    0x10e7de5D6Ab08jdki3mnxz21d938dC8F8c5903d9
                </div>
            </div>
            <div class="transaction__account__arrow">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
            </div>
            <div class="transaction__account__user">
                <img src="${user4}" alt="User Icon">
                <h3>Gabriel Clayton</h3>
                <div class="hover-info--1">
                    <div class="hover-info--1__triangle"></div>
                    Gabriel Clayton
                </div>
            </div>
        </div>

        <div class="transaction__send">
            <h3>SENT ETHER</h3>
            <div class="transaction__send__flex">
                <img src="${ethIcon2}" alt="ETH Icon">
                <div>
                    <input type="number">
                    <div class="h3">$3121.16</div>
                </div>
            </div>
        </div>

        <div class="transaction__balance">
            <h3>Ether Balance : <span class="transaction__balance__span">3.0120</span></h3>
        </div>

        <div class="transaction__checkout">
            <h2>Estimated gas fee</h2>
            <div class="transaction__checkout__time">
                Likely in &lt; 30 Sec
            </div>
            <div class="transaction__checkout__input">
                <h3>0.000823 ETH <span>$3.37</span></h3>
                <div class="transaction__checkout__input__edit">
                    <img src="${editPen}" alt="Edit Pen Icon">
                </div>
            </div>
            <h4>Max Fee: 0.000823</h4>
            <div class="transaction__checkout__line"></div>
            <div class="transaction__checkout__total">
                <h2>Total</h2>
                <h3>0.823823 ETH <span>$3123.53</span></h3>
                <h4>Max amount: 0.823823 ETH</h4>
                <h5>Amount + gas fee</h5>
            </div>
        </div>

        <button class="btn__tp--1" id="confirm_trans">Confirm</button>
        <button class="btn__tp--2">Reject</button>
        <button class="btn__tp--2 c--gray">
            Open Wallet
            <img src="${popOut}" alt="Open Wallet Pop Out Icon">
        </button>

        <div class="transaction__pop-up--overlay" style="display: none;">
            <div class="transaction__pop-up">

                <div class="transaction__pop-up__div">

                    <div class="transaction__pop-up__header">
                        <h3>Txn Fee:</h3>
                        <img class="transaction__pop-up__close" src="${closeImg}" alt="Close Icon">
                    </div>
        
                    <div class="transaction__pop-up__body">
                        <div class="transaction__pop-up__body--flex">
                            <img src="${ethIcon2}" alt="ETH ICON">
                            <div>
                                <h2>0.000823</h2>
                                <div class="transaction__checkout__time">
                                    Likely in &lt; 30 Sec
                                </div>
                                <!-- dropdown-open -->
                                <div class="dropdown__tp--4 dropdown-open">
                                    Advanced Options
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="svg-inline--fa fa-angle-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div class="dropdown__tp--4__content">
                            <div class="checkbox__ctn">
                                <h3>Priority fee (Gwei)</h3>
                                <div class="checkbox--flex">
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span>Fast <br> 100</span>
                                            <input type="radio" name="radio1">
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span>Standard <br> 50.5</span>
                                            <input type="radio" name="radio1">
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                </div>
                                <div class="checkbox--flex">
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span>Slow <br> 46</span>
                                            <input type="radio" name="radio1">
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span>Custom</span>
                                            <input type="radio" name="radio1">
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <!-- inactive class -->
                            <div class="transaction__select__ctn inactive">
                                <div class="transaction__select__label">
                                    <h3>Gas limit</h3>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" class="svg-inline--fa fa-info-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
                                </div>
                                <div class="transaction__select">
                                    <input type="number">
                                    <div class="transaction__select__arrow">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" class="svg-inline--fa fa-chevron-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <!-- inactive class -->
                            <div class="transaction__select__ctn">
                                <div class="transaction__select__label">
                                    <h3>Priority fee</h3>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" class="svg-inline--fa fa-info-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
                                </div>
                                <div class="transaction__select">
                                    <input type="number">
                                    <div class="transaction__select__arrow">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" class="svg-inline--fa fa-chevron-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                                    </div>
                                </div>
                            </div>
    
                        </div>
                    </div>
        
                    <div class="transaction__pop-up__footer">
                        <a href="#">Tips & tricks for beginners?</a>
                        <button class="btn__tp--1">Proceed</button>
                        <button class="btn__tp--4">Cancel</button>
                    </div>

                </div>
    
            </div>
        </div>

    </div>`
    }

}

export default SwitchChainScreen;