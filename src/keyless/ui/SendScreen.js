import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import networkImg from './../images/network-icon.svg';
import user4 from './../images/user-4.webp'
import tokenIcon from './../images/token-icon.webp'
import editPenIcon from './../images/edit-pen.svg'
import ethIcon from './../images/eth-icon.svg'
import eth2Icon from './../images/eth-icon-2.svg'
import popoutImg from './../images/pop-out.svg'

import UIScreen from '../classes/UIScreen';
import ConfirmationDialog from './components/ConfirmationDialog';
import ConnectedStatus from './components/ConnectedStatus';
import {middleEllipsisMax, formatXDecimals } from '../helpers/helpers';


class SendScreen extends UIScreen {

    nativeTokenName = 'ETH';
    gasFees = {};
    chosenFee = 'medium';
    advancedFee = 'medium';
    likeTime = 30;
    feeETH = 0;
    feeUSD = 0;
    customGasLimit = 0;
    customPrioFee = 0;
    amt = 0;
    amountUSD = 0;
    balance = 0;
    feeTm = false;

    onShow(){
        this.setProceedActive( false );
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            clearInterval( this.feeTm );
            this.keyless._hideUI();
            this.keyless.kctrl.clearActiveTransaction( true );
        });
        
        //transaction__account__address
        // this.el.querySelector('.transaction__account__address').addEventListener('click', (e) => {
        //       e.preventDefault();
        //       this.keyless.selectChain();
        // });
        //used in 2 places
        let edit_popup = this.el.querySelector('.transaction__pop-up--overlay');
        let adv_options_content = this.el.querySelector('.dropdown__tp--4__content');
        let adv_options_btn = this.el.querySelector('.adv_option-btn');

        //transaction__pop-up__close
        this.el.querySelector('.transaction__pop-up__close').addEventListener('click', (e) => {
          e.preventDefault();
          console.log('clicked close modal');
          
          if(edit_popup.classList.contains('closed')){
            edit_popup.classList.remove('closed');

          }else{

            edit_popup.classList.add('closed');
            // close adv option btn and content
             adv_options_btn.classList.remove('dropdown-open');
             adv_options_content.classList.add('hide');
          }
        });

        //transaction__checkout__input__edit
        this.el.querySelector('.transaction__checkout__input__edit').addEventListener('click', (e) => {
              e.preventDefault();
              console.log('clicked edit pen');
              
              if(edit_popup.classList.contains('closed')){
                edit_popup.classList.remove('closed');
              }else{
                edit_popup.classList.add('closed');
              }

              this.el.querySelector('.transaction__pop-up__div .transaction__pop-up__body h2').innerHTML = this.feeETH;
              this.el.querySelector('.transaction__pop-up__div .transaction__checkout__time').innerHTML = 'Likely in < '+ this.likeTime + ' Sec';

              this.populateOptions();

              clearInterval( this.feeTm );
        });

        // advanced options 
        adv_options_btn.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('toggle adv options');
              
              if(adv_options_content.classList.contains('hide')){
                adv_options_content.classList.remove('hide');
                adv_options_btn.classList.add('dropdown-open');

              }else{
                adv_options_content.classList.add('hide');
                adv_options_btn.classList.remove('dropdown-open');
              }
        });
        // clicked options
        // check if custom else disable
        let radioVal;
        const radios = document.querySelectorAll('input[name="fee_gwei"]');
        const gas_limit =  this.el.querySelector('.gas_limit');
        const priority_fee =  this.el.querySelector('.priority_fee');
        const radio_parent =  Array.from(document.querySelectorAll('.transaction__select__ctn'));
        radios.forEach(radio => {
            radio.addEventListener('click', () => {
                radioVal = radio.value;
                if(radioVal != 'custom'){
                    //add disable
                    gas_limit.setAttribute('disabled', 'disabled');
                    priority_fee.setAttribute('disabled', 'disabled');
                    radio_parent[0].classList.add('inactive');
                    radio_parent[1].classList.add('inactive');
                }else{
                    //remove disable
                    gas_limit.removeAttribute('disabled');
                    priority_fee.removeAttribute('disabled');
                    radio_parent[0].classList.remove('inactive');
                    radio_parent[1].classList.remove('inactive');
                }

                this.advancedFee = radioVal;
                this.calculateCustomFee();
            });
        });

        this.el.querySelector('.proceed_popup_btn').addEventListener('click', (e) => {
              e.preventDefault();
              console.log('clicked proceed popup btn');

            // this.gas_limit =  this.el.querySelector('.gas_limit').value;
            // this.priority_fee =  this.el.querySelector('.priority_fee').value;
            this.calculateCustomFee();
            this.populateGasEstimate();

              // close popup 
              edit_popup.classList.add('closed');
              // close adv options 
              adv_options_content.classList.add('hide');
              adv_options_btn.classList.remove('dropdown-open');
              // save your options
            this.addFeeInterval();
        });
        Array.from( this.el.querySelectorAll('.cancel_popup_btn, .transaction__pop-up__close') ).forEach( ( el ) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('clicked cancel popup btn');
                // close popup 
                edit_popup.classList.add('closed');
                // close adv options 
                adv_options_content.classList.add('hide');
                adv_options_btn.classList.remove('dropdown-open');
                
                // remove values and checkboxes
                radioVal = '';
                gas_limit.setAttribute('disabled', 'disabled');
                priority_fee.setAttribute('disabled', 'disabled');
                radio_parent[0].classList.add('inactive');
                radio_parent[1].classList.add('inactive');
    
                //uncheck all checkboxes
                radios.forEach(function(radio, index){
                radios[index].checked = false;
                });
                //remove any modifcation ro gas_limit / priority fee [ set them back to default]
                // gas_limit.value = '21000';
                // priority_fee.value = '1.5';

                if( this.chosenFee != 'custom'){
                    this.addFeeInterval();
                }                
            });
        });

        this.el.querySelector('.tips_btn').addEventListener('click', (e) => {
              e.preventDefault();
              console.log('clicked tips_btn');
        }); 

        this.el.querySelector('.open_wallet_btn').addEventListener('click', (e) => {
              e.preventDefault();
              console.log('clicked open_wallet_btn');
        });  
        this.el.querySelector('.confirm_btn').addEventListener('click', async (e) => {
            clearInterval( this.feeTm );
            // this.keyless.kctrl.activeTransaction.resolve({ status: 'sent' });
            // this.keyless._hideUI();
            const chosenGas = this.gasFees[ this.advancedFee ];
            
            if( this.advancedFee == 'custom'){
                this.keyless.kctrl.setGasForTransaction( this.customGasLimit, this.gasFees['medium'].suggestedMaxFeePerGas, this.customPrioFee );
            } else {
                const trans = this.keyless.kctrl.getActiveTransaction();
                const gas = await this.keyless.kctrl.estimateGas( trans.data );
                this.keyless.kctrl.setGasForTransaction( gas, chosenGas.suggestedMaxFeePerGas, chosenGas.suggestedMaxPriorityFeePerGas );
            }
            // console.log( this.keyless.kctrl.activeTransaction );

            this.keyless._showUI('pin');

            e.preventDefault();
            console.log('clicked confirm_btn');
        }); 

        this.el.querySelector('.reject_btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Show reject confirmation modal
            return new ConfirmationDialog(
                this.el, 
                `Are you sure you want to reject this transaction?`, 
                `Accept`, 
                this.rejectConfirmCallback
            );
        });

        // inputs values up and down
        const inputs_arrow_gas = document.querySelectorAll('.gas_limit_wrp');
        // .transaction__select__arrow

        inputs_arrow_gas.forEach(up_down => {

            // find if up click or down click do stuff
            let down_arrow = up_down.querySelector('.input_down');
            let up_arrow = up_down.querySelector('.input_up');
            let input_val = up_down.querySelector('input[type="number"]');
            let input_val_total;

            down_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseInt(input_val.value);
                // remove 10 points to this value
                input_val_total -= 10;
                input_val.value = Math.max(input_val_total, 0 )
            });
            up_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseInt(input_val.value);
                input_val_total += 10;
                // add 10 points to this value                
                input_val.value = Math.max(input_val_total, 0 )
                this.calculateCustomFee();
            });
        });
        // inputs values up and down
        const inputs_arrow_fee = document.querySelectorAll('.priority_fee_wrp');
        // .transaction__select__arrow

        inputs_arrow_fee.forEach(up_down => {

            // find if up click or down click do stuff
            let down_arrow = up_down.querySelector('.input_down');
            let up_arrow = up_down.querySelector('.input_up');
            let input_val = up_down.querySelector('input[type="number"]');
            let input_val_total;

            down_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseFloat(input_val.value);
                // remove 10 points to this value
                input_val_total -= 1;
                input_val.value = Math.max(input_val_total, 0 ).toFixed(1);

                this.calculateCustomFee();
            });
            up_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseFloat(input_val.value);
                input_val_total += 1;
                // add 10 points to this value                
                input_val.value = Math.max(input_val_total, 0 ).toFixed(1);

                this.calculateCustomFee();
            });
        });

        this.populateData();
        this.populateGasEstimate();
        clearInterval( this.feeTm );
        this.addFeeInterval();
    }

    addFeeInterval(){
        if( this.chosenFee != 'custom'){
            this.feeTm = setInterval( () => this.populateGasEstimate(), 30000 );
        }
    }

    populateOptions(){
        this.el.querySelector('.transaction__pop-up__body .option_high').innerHTML = parseInt( this.gasFees['high'].suggestedMaxFeePerGas );
        this.el.querySelector('.transaction__pop-up__body .option_medium').innerHTML = parseInt( this.gasFees['medium'].suggestedMaxFeePerGas );
        this.el.querySelector('.transaction__pop-up__body .option_low').innerHTML = parseInt( this.gasFees['low'].suggestedMaxFeePerGas );
    }

    async calculateCustomFee(){
        const trans = this.keyless.kctrl.getActiveTransaction();
        let likeTime;
        let fee, feeETH;

        

        if( this.advancedFee == 'custom'){
            likeTime = false;
            const gasLimit = this.el.querySelector('.gas_limit').value;
            const priorityFee = this.el.querySelector('.priority_fee').value;
            fee = ( parseInt( this.gasFees['medium'].suggestedMaxFeePerGas ) + parseInt( priorityFee ) ) * gasLimit;
            feeETH = this.keyless.kctrl.getFeeInEth(fee);
            this.chosenFee = 'custom';
            this.customGasLimit = gasLimit;
            this.customPrioFee = priorityFee;

        } else {
            this.chosenFee = this.advancedFee;
            const chosenGas = this.gasFees[ this.advancedFee ];
            console.log('gas', chosenGas )
            
            likeTime = Math.round( chosenGas.minWaitTimeEstimate + ( chosenGas.maxWaitTimeEstimate - chosenGas.minWaitTimeEstimate )/2)/1000;
            const gas = await this.keyless.kctrl.estimateGas( trans.data );
            fee = ( parseInt( chosenGas.suggestedMaxFeePerGas ) + parseInt( chosenGas.suggestedMaxPriorityFeePerGas) ) * gas;
            feeETH = this.keyless.kctrl.getFeeInEth(fee);
        }        

        this.el.querySelector('.transaction__pop-up__div .transaction__pop-up__body h2').innerHTML = formatXDecimals( feeETH, 6 );
        this.el.querySelector('.transaction__pop-up__div .transaction__checkout__time').innerHTML = likeTime ? 'Likely in < '+ likeTime + ' Sec' : 'Unkown Sec';
    }

    async populateGasEstimate(){
        const trans = this.keyless.kctrl.getActiveTransaction();

        // console.log( this.chosenFee );
        if( this.chosenFee == 'custom'){
            console.log('calc. custom fee ', this.customGasLimit );

            this.el.querySelector('.transaction__checkout__time').innerHTML = 'unknown';
            const chosenGas = this.gasFees[ 'medium' ];
            
            const fee = ( parseInt( chosenGas.suggestedMaxFeePerGas ) + parseInt( this.customPrioFee ) ) * this.customGasLimit;
            this.feeETH = this.keyless.kctrl.getFeeInEth(fee);
            this.feeUSD = await this.keyless.kctrl.getBalanceInUSD( this.feeETH );
            const maxFeePerGas = this.keyless.kctrl.getFeeInEth( parseInt( chosenGas.suggestedMaxFeePerGas ) );
            // console.log( 'chosenGas', gas, fee );
            // console.log( feeETH, feeUSD );
            this.el.querySelector('.transaction__checkout__input h3')
            .innerHTML = this.feeETH +' '+ this.nativeTokenName + 
            '<span> $' + this.feeUSD + '</span>';
            this.el.querySelector('.transaction__checkout h4').innerHTML = '<span>Max Fee: </span>' + maxFeePerGas;
            
            this.setFeesLoading( false );

            this.populateFees();


        } else {
            this.setFeesLoading( true );

            this.gasFees = await this.keyless.kctrl.estimateFees();
            const gas = await this.keyless.kctrl.estimateGas( trans.data );
            console.log('GAS', gas, this.gasFees );

            if( this.gasFees ){
                const chosenGas = this.gasFees[ this.chosenFee ];
                this.likeTime = Math.round( chosenGas.minWaitTimeEstimate + ( chosenGas.maxWaitTimeEstimate - chosenGas.minWaitTimeEstimate )/2)/1000;
                this.el.querySelector('.transaction__checkout__time').innerHTML = 'Likely in < '+ this.likeTime +' Sec';

                const fee = ( parseInt( chosenGas.suggestedMaxFeePerGas ) + parseInt( chosenGas.suggestedMaxPriorityFeePerGas) ) * gas;
                this.feeETH = this.keyless.kctrl.getFeeInEth(fee);
                this.feeUSD = await this.keyless.kctrl.getBalanceInUSD( this.feeETH );
                const maxFeePerGas = this.keyless.kctrl.getFeeInEth( parseInt( chosenGas.suggestedMaxFeePerGas ) );
                // console.log( 'chosenGas', gas, fee );
                // console.log( feeETH, feeUSD );
                this.el.querySelector('.transaction__checkout__input h3')
                .innerHTML = this.feeETH +' '+ this.nativeTokenName + 
                '<span> $' + this.feeUSD + '</span>';
                this.el.querySelector('.transaction__checkout h4').innerHTML = '<span>Max Fee: </span>' + maxFeePerGas;

                this.populateFees();
            }

            await new Promise( ( res, rej ) => {
                setTimeout( () => { res(); }, 2000 );
            });
            this.setFeesLoading( false );            
        }
        
    }

    async populateFees(){
        const totalAmt = parseFloat( this.amt ) + parseFloat( this.feeETH );
        const totalUSD = formatXDecimals( parseFloat( this.amountUSD ) + parseFloat( this.feeUSD ), 4 );
        this.el.querySelector('.transaction__checkout__total h3').innerHTML = 
            totalAmt+' '+ this.nativeTokenName + '<span>$' + totalUSD +'</span>';
        
         this.el.querySelector('.transaction__checkout__total h4').innerHTML = 'Max amount: '+ totalAmt;
         this.checkCanProceed();
    }

    async populateData(){
        this.nativeTokenName = (await this.keyless.kctrl.getCurrentNativeToken()).toUpperCase();
        const trans = this.keyless.kctrl.getActiveTransaction();
        if( trans ){
            this.populateAddresses( trans );
            this.keyless.kctrl._setLoading( true );
            // await Promise.all( [
                await this.populateBalance(),
                await this.populateAmount( trans )
            // ] );
            this.keyless.kctrl._setLoading( false );
        }

        this.connectionStatus = this.keyless.isConnected(); // Check connectivity status
        const connectionEl = this.el.querySelector('#connection-status');
        const connStatusEl = new ConnectedStatus(connectionEl, this.connectionStatus);
    }

    async populateAddresses( trans ){
        const activeTrans = trans;
        const fromAddress = this.keyless.kctrl.getAccounts().address;
        const fromCont = this.el.querySelector('.transaction__account .transaction__account__address h3');
        fromCont.innerHTML = middleEllipsisMax( fromAddress, 4 );
        fromCont.parentNode.querySelector('.hover-info--1').innerText = fromAddress;
        const isSafleId = await this.keyless.kctrl.getSafleIdFromAddress( activeTrans.data.to );
        const toAddress = activeTrans.data.to;

        const toCont = this.el.querySelector('.transaction__account .transaction__account__user h3');
        toCont.innerHTML = isSafleId? isSafleId : middleEllipsisMax( toAddress, 4 );
        toCont.parentNode.querySelector('.hover-info--1').innerText = toAddress;
    }

    async populateBalance(){
        this.balance = await this.keyless.kctrl.getWalletBalance( this.keyless.kctrl.getAccounts().address, true, 6 );
        // const trans = this.keyless.kctrl.getActiveTransaction();
        // const val = this.keyless.kctrl.web3.utils.fromWei( trans.data.value.toString(), 'ether');
        this.el.querySelector('.transaction__balance__span').innerHTML = this.balance;
    }

    async populateAmount( trans ){
        console.log( trans );
        const amt = trans.data.value;
        this.amt = this.keyless.kctrl.web3.utils.fromWei( amt.toString(), 'ether');
        this.el.querySelector('.transaction__send .transaction_amount').value = this.amt;
        
        console.log('populate amount ');
        console.log( parseFloat(this.balance), ( parseFloat(this.amt) + parseInt(this.feeETH ) ) )
        if( parseFloat(this.balance) < ( parseFloat(this.amt) + parseInt(this.feeETH ) ) ){
            this.el.querySelector('.transaction__send').classList.add('low-balance');
        } else {
            this.el.querySelector('.transaction__send').classList.remove('low-balance');
        }

        this.amountUSD = await this.keyless.kctrl.getBalanceInUSD( this.amt );
        this.el.querySelector('.transaction__send .balance-usd').innerHTML = '$'+this.amountUSD;
    }

    setFeesLoading( flag ){
        if( flag ){
            console.log('loading true');
            this.el.classList.add('fee_loading');
            this.checkCanProceed();
        } else {
            console.log('loading stopped');
            this.el.classList.remove('fee_loading');
            this.checkCanProceed();
        }
    }
    setProceedActive( flag ){
        if( flag ){
            this.el.querySelector('.confirm_btn').removeAttribute('disabled');
        } else {
            this.el.querySelector('.confirm_btn').setAttribute('disabled', 'disabled');
        }
    }
    
    rejectConfirmCallback = () => {
        clearInterval( this.feeTm );
        this.keyless.kctrl.activeTransaction.reject( {
            message: 'User rejected the transaction',
            code: 4200,
            method: 'User rejected'
        });
        this.keyless._hideUI();
    }

    checkCanProceed(){
        console.log('check can proceed');
        console.log( (parseFloat( this.amt ) + parseFloat( this.feeETH )), parseFloat( this.balance ) );

        if( parseFloat( this.balance ) < (parseFloat( this.amt ) + parseFloat( this.feeETH )) ){
           this.setProceedActive( true );
        } else {
            this.setProceedActive( true );
        }
    }

    render(){

        return `<div class="transaction">

        <div class="transaction__header">
            <img class="close" src="${closeImg}" alt="Close Icon">
            <div id="connection-status"></div>
            <a class="logo" href="#">
                <img src="${logoImg}" alt="Safle Logo">
            </a>
        </div>

        <div class="transaction__account">
            <div class="transaction__account__address">
                <img src="${tokenIcon}" alt="Network Icon">
                <h3></h3>
                <div class="hover-info--1">
                    <div class="hover-info--1__triangle"></div>
                    
                </div>
            </div>
            <div class="transaction__account__arrow">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
            </div>
            <div class="transaction__account__user">
                <img src="${user4}" alt="User Icon">
                <h3></h3>
                <div class="hover-info--1">
                    <div class="hover-info--1__triangle"></div>
                    
                </div>
            </div>
        </div>

        <div class="transaction__send">
            <h3>SEND ${this.nativeTokenName}</h3>
            <div class="transaction__send__flex">
                <img src="${ethIcon}" alt="ETH Icon">
                <div>
                    <input type="number" value='' readonly class="transaction_amount">
                    <div class="h3 balance-usd">$0</div>
                </div>
            </div>
        </div>

        <div class="transaction__balance">
            <h3>${this.nativeTokenName} Balance : <span class="transaction__balance__span">3.0120</span></h3>
        </div>

        <div class="transaction__checkout">
            <h2>Estimated gas fee</h2>
            <div class="transaction__checkout__time">
                Likely in &lt; 30 Sec
            </div>
            <div class="transaction__checkout__input">
                <h3>0 ETH <span>$0</span></h3>
                <div class="transaction__checkout__input__edit">
                    <img src="${editPenIcon}" alt="Edit Pen Icon">
                </div>
            </div>
            <h4><span>Max Fee:</span> 0</h4>
            <div class="transaction__checkout__line"></div>
            <div class="transaction__checkout__total">
                <h2>Total</h2>
                <h3>0.823823 ETH <span>$3123.53</span></h3>
                <h4>Max amount: 0.823823 ETH</h4>
                <h5>Amount + gas fee</h5>
            </div>
        </div>

        <button class="btn__tp--1 confirm_btn">Confirm</button>
        <button class="btn__tp--2 reject_btn">Reject</button>
        <button class="btn__tp--2 c--gray open_wallet_btn">
            Open Wallet
            <img src="${popoutImg}" alt="Open Wallet Pop Out Icon">
        </button>

        <div class="transaction__pop-up--overlay closed">
            <div class="transaction__pop-up">

                <div class="transaction__pop-up__div">

                    <div class="transaction__pop-up__header">
                        <h3>Txn Fee:</h3>
                        <img class="transaction__pop-up__close" src="${closeImg}" alt="Close Icon">
                    </div>
        
                    <div class="transaction__pop-up__body">
                        <div class="transaction__pop-up__body--flex">
                            <img class='transaction__pop-up-item-icon' src="${eth2Icon}" alt="ETH ICON">
                            <div>
                                <h2>0.000823</h2>
                                <div class="transaction__checkout__time">
                                    Likely in &lt; 30 Sec
                                </div>
                                <!-- dropdown-open -->
                                <div class="dropdown__tp--4 adv_option-btn">
                                    Advanced Options
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="svg-inline--fa fa-angle-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9">
                                        <path d="m7 9 .77-.759L14 2.084 12.46 0 7 5.398 1.54 0 0 2.084A254430.373 254430.373 0 0 0 7 9z" fill="#007AFF" fill-rule="nonzero"/>
                                    </svg>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="dropdown__tp--4__content hide">
                            <div class="checkbox__ctn inactive">
                                <h3>Priority fee (Gwei)</h3>
                                <div class="checkbox--flex">
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span class='light'>Fast <br><span class='bigger option_high'>100</span></span>
                                            <input type="radio" name="fee_gwei" value='high' class='checkbox_fee_qwei'>
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span class='light'>Standard <br><span class='bigger option_medium'>50.5</span></span>
                                            <input type="radio" name="fee_gwei" value='medium' class='checkbox_fee_qwei'>
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                </div>
                                <div class="checkbox--flex">
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span class='light'>Slow <br><span class='bigger option_low'>46</span></span>
                                            <input type="radio" name="fee_gwei" value='low' class='checkbox_fee_qwei'>
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                    <div class="checkbox--flex__item">
                                        <label class="b-contain">
                                            <span class='light'>Custom</span>
                                            <input type="radio" name="fee_gwei" value='custom' class='checkbox_fee_qwei'>
                                            <div class="b-input"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <!-- inactive class -->
                            <div class="transaction__select__ctn inactive">
                                <div class="transaction__select__label">
                                    <h3>Gas limit</h3>
                                    <div class='transaction__select__label_tooltip'>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" class="svg-inline--fa fa-info-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
                                        <div class='transaction__select__label_tooltiptext'>
                                            Lorem Ipsum is not simply random text
                                        </div>
                                    </div>
                                </div>
                                <div class="transaction__select gas_limit_wrp">
                                    <input type="number" value='21000' class='gas_limit' disabled='disabled'>
                                    <div class="transaction__select__arrow">
                                        <div class='input_up'>
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" class="svg-inline--fa fa-chevron-up fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg>
                                        </div>
                                        <div class='input_down'>                                        
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- inactive class -->
                            <div class="transaction__select__ctn inactive">
                                <div class="transaction__select__label">
                                    <h3>Priority fee</h3>
                                    <div class='transaction__select__label_tooltip'>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" class="svg-inline--fa fa-info-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
                                        <div class='transaction__select__label_tooltiptext'>
                                            Lorem Ipsum is not simply random text
                                        </div>
                                    </div>
                                </div>
                                <div class="transaction__select priority_fee_wrp">
                                    <input type="number" value='1.5' class='priority_fee' disabled='disabled'>
                                    <div class="transaction__select__arrow">
                                        <div class='input_up'>
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" class="svg-inline--fa fa-chevron-up fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg>
                                        </div>
                                        <div class='input_down'>                                        
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                        </div>
                    </div>
        
                    <div class="transaction__pop-up__footer">
                        <a href="#" class='tips_btn'>Tips & tricks for beginners?</a>
                        <button class="btn__tp--1 proceed_popup_btn">Proceed</button>
                        <button class="btn__tp--4 cancel_popup_btn">Cancel</button>
                    </div>

                </div>
    
            </div>
        </div>

    </div>`
    }

}

export default SendScreen;