import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import tokenIconImg from './../images/token-icon.webp';
import copyIcon from './../images/copy-icon.svg';
import UIScreen from '../classes/UIScreen';
import { copyToClipboard, middleEllipsisMax } from '../helpers/helpers';
import ConfirmationDialog from './components/ConfirmationDialog';


class PinScreen extends UIScreen {

    onShow(){
        this.el.querySelector('.close').addEventListener('click', ( e ) => {
            e.preventDefault();
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this transaction?`, 
                `Accept`, 
                () => {
                    this.keyless.kctrl.activeTransaction && this.keyless.kctrl.activeTransaction.reject( {
                        message: 'User rejected the transaction',
                        code: 4200,
                        method: 'User rejected'
                    });
                    this.keyless.kctrl.activeSignRequest && this.keyless.kctrl.activeSignRequest.reject( {
                        message: 'User rejected the transaction',
                        code: 4200,
                        method: 'User rejected'
                    });

                    this.keyless._hideUI();
                }
            );   
        });
        this.input = this.el.querySelector('.pin-codes input');
        this.error = this.el.querySelector('.error-boundary');
        this.input.value = '';
        this.input.focus();
        this.el.querySelector('.input-areas').innerHTML = new Array(6).fill('').map( e => '<div class="input-cell"></div>').join('') ;
        this.pinHandlers();


        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            
            const address = this.getAddress();
            copyToClipboard( address );
        });

        this.el.querySelector('.cancel_btn').addEventListener('click', (e) => {
            e.preventDefault();
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this transaction?`, 
                `Accept`, 
                () => {
                    this.keyless.kctrl.activeTransaction && this.keyless.kctrl.activeTransaction.reject( {
                        message: 'User rejected the transaction',
                        code: 4200,
                        method: 'User rejected'
                    });
                    this.keyless.kctrl.activeSignRequest && this.keyless.kctrl.activeSignRequest.reject( {
                        message: 'User rejected the transaction',
                        code: 4200,
                        method: 'User rejected'
                    });
                    this.keyless._hideUI();
                }
            );            
        });
        this.el.querySelector('.proceed_btn').addEventListener('click', async (e) => {
            e.preventDefault();

            this.keyless.kctrl._setLoading( true );

            const pin = this.input.value;
            const pinValid = await this.keyless.kctrl.checkPin( pin );
            if( !pinValid ){
                this.showError( 'PIN is invalid');
            } else {
                if( this.keyless.kctrl.activeTransaction ){
                    const txReceipt = await this.keyless.kctrl._createAndSendTransaction( parseInt( pin ) );
                } else if( this.keyless.kctrl.activeSignRequest ){
                    const encMsg = await this.keyless.kctrl._signMessage( parseInt( pin ) );

                    
                } else {
                    throw new Error('Invalid invocation of PinConfirm Screen');
                }
            }
            this.keyless.kctrl._setLoading( false );
        });
 
        this.populateAddress();
        
    }

    showError( msg ){
        if( msg != '' ){
            this.error.innerHTML = msg;
            this.el.querySelector('.pin_code_container').classList.add('error');
        } else {
            this.error.innerHTML = '';
            this.el.querySelector('.pin_code_container').classList.remove('error');
        }
    }
    populateAddress(){
        const address = this.getAddress();
        this.el.querySelector('.copy-address h3').innerHTML = middleEllipsisMax( address, 4 );
    }

    getAddress(){
        let address = this.keyless.kctrl.activeTransaction? this.keyless.kctrl.activeTransaction.data.from : null;
        if( !address ){
            address = this.keyless.kctrl.activeSignRequest.address;
        }
        return address;
    }

    pinHandlers(){
        this.submitBtn = this.el.querySelector('.proceed_btn');
        this.submitBtn.setAttribute('disabled', 'disabled');
        this.pinDisplay = this.el.querySelector('.input-areas');
        this.input.addEventListener('click', () => {
            this.cursorHandler();       
            this.showError('');
        });

        this.el.addEventListener('keyup', ( e ) => {
            let val = this.input.value.trim();
            if( val.length > 6 ){
                val = val.slice( 0, 6 );
                this.input.value = val;
            }
            if( val.length == 6 ){
                this.submitBtn.removeAttribute('disabled');
            } else {
                this.submitBtn.setAttribute('disabled', 'disabled');
            }
            
            this.pinDisplay.innerHTML =                  
                val.split('').map( ( e, idx ) => {
                    if( idx < val.length -1 ){
                        return '<div class="input-cell filled hidden">'+e+'</div>';
                    }
                    return '<div class="input-cell filled">'+e+'</div>';
                 }).join('')+ 
                new Array( 6-val.length ).fill('').map( e=> '<div class="input-cell"></div>').join('') ;
            this.cursorHandler();
        });

        //add event listner
        this.input.addEventListener('blur', () => {
            this.pinDisplay.querySelector('.input-cell').classList.remove('focused');
        });
    }
    cursorHandler() {
        this.pinDisplay.querySelector('.input-cell').classList.remove('focused');
        const cell = Array.from(this.pinDisplay.querySelectorAll('.input-cell:not(.filled)'));
        cell.length && cell[0].classList.add('focused');
    }

    render(){

        return `<div class="pin">
        
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

        <div class="pin__header">

            <a class="logo" href="#">
                <img src="${logoImg}" alt="Safle Logo">
            </a>

            <div class="copy-address">
                <img src="${tokenIconImg}" alt="Token Icon">
                <h3></h3>
                <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
            </div>

        </div>
        

        <div class="pin__input__ctn">
            <h3>Enter your PIN</h3>
            <div class='pin_code_container'>
                <div class="error"><div class="error-boundary"></div></div>
                <div class="pin-codes">
                    <div class="input-pin">
                        <input type="number" name="pin" autocomplete='off' value="" maxlength="6" />
                        <div class="input-areas">
                            <div class="input-cell"></div>
                            <div class="input-cell"></div>
                            <div class="input-cell"></div>
                            <div class="input-cell"></div>
                            <div class="input-cell"></div>
                            <div class="input-cell"></div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="pin__controls">
            <button class="btn__tp--1 proceed_btn">Proceed</button>
            <button class="btn__tp--2 cancel_btn">Cancel</button>
        </div>

    </div>`
    }

}

export default PinScreen;