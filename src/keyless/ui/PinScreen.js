import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import tokenIconImg from './../images/token-icon.webp';
import copyIcon from './../images/copy-icon.svg';
import UIScreen from '../classes/UIScreen';
import {copyToClipboard} from '../helpers/helpers';


class PinScreen extends UIScreen {

    onShow(){
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });
        this.input = this.el.querySelector('.pin-codes input');
        this.input.value = '';
        this.el.querySelector('.input-areas').innerHTML = new Array(6).fill('').map( e => '<div class="input-cell"></div>').join('') ;
        this.pinHandlers();


        this.el.querySelector('.copy-to-clipboard').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('copied to clipboard');
            copyToClipboard('0x1deaA720C9Be705D47CB05B30E549CC9b0E5128D');
        });

        this.el.querySelector('.cancel_btn').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('clicked cancel');
        });
        this.el.querySelector('.proceed_btn').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('clicked proceed');
        });
        
    }
    pinHandlers(){
        this.submitBtn = this.el.querySelector('.proceed_btn');
        this.submitBtn.setAttribute('disabled', 'disabled');
        this.pinDisplay = this.el.querySelector('.input-areas');
        //add event listner
        this.input.addEventListener('click', () => {
            this.cursorHandler();       
        });

        //add event listner
        this.el.addEventListener('keyup', ( e ) => {
            // console.log( e.keyCode );
            // if( !( (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8) ){
            //     console.log('prevented');
            //     e.preventDefault();
            // }
            // console.log( this.input.get(0).value );

            var val = this.input.value.trim();
            // console.log( val );
            if( val.length > 6 ){
                return false;
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
                <h3>0x10e7…203d9</h3>
                <img class="copy-to-clipboard" src="${copyIcon}" alt="Copy to clipboard icon">
            </div>

        </div>
        

        <div class="pin__input__ctn">
            <h3>Enter your PIN</h3>
            <div class='pin_code_container'>
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