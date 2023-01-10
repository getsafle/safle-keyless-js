import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';

import user4 from './../images/user-4.webp'
import tokenIcon from './../images/token-icon.webp'
import editPenIcon from './../images/edit-pen.svg'
import ethIcon from './../images/eth-icon.svg'
import eth2Icon from './../images/eth-icon-2.svg'
import popoutImg from './../images/pop-out.svg'

import UIScreen from '../classes/UIScreen';
import ConfirmationDialog from './components/ConfirmationDialog';
import ConnectedStatus from './components/ConnectedStatus';
import { middleEllipsisMax, formatXDecimals, formatMoney } from '../helpers/helpers';
import { decodeInput } from '../helpers/safleHelpers';
import txEstimates from '../helpers/txEstimates';
import blockchainInfo from '../helpers/blockchains';

const debounce = (fn, delay) => {
    let tm = false;
    return (e) => {
        if (tm) {
            clearTimeout(tm);
        }
        tm = setTimeout(fn, delay);
    }
}

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
    tokenIcon = '';
    isToken = false;
    tokenValue = 0;
    decodedData = null;

    onShow() {
        this.setProceedActive(false);
        this.el.querySelector('.close').addEventListener('click', () => {
            clearInterval(this.feeTm);
            this.keyless._hideUI();
            this.keyless.kctrl.clearActiveTransaction(true);
        });

        let edit_popup = this.el.querySelector('.transaction__pop-up--overlay');
        let adv_options_content = this.el.querySelector('.dropdown__tp--4__content');
        let adv_options_btn = this.el.querySelector('.adv_option-btn');
        this.chainIconEl = this.el.querySelector('.transaction__pop-up-item-icon');

        const activeChainId = this.keyless.getCurrentChain().chainId;
        this.activeChain = blockchainInfo[activeChainId] || 'no known active chain';
        const chainName = this.activeChain.chain_name;


        this.chainIconEl.src = (chainName == 'ethereum' || chainName == 'ropsten') ? this.keyless.kctrl.getTokenIcon('eth') : this.keyless.kctrl.getTokenIcon('matic');

        this.el.querySelector('.transaction__pop-up__close').addEventListener('click', (e) => {
            e.preventDefault();


            if (edit_popup.classList.contains('closed')) {
                edit_popup.classList.remove('closed');

            } else {

                edit_popup.classList.add('closed');
                adv_options_btn.classList.remove('dropdown-open');
                adv_options_content.classList.add('hide');
            }
        });

        this.el.querySelector('.transaction__checkout__input__edit').addEventListener('click', (e) => {
            e.preventDefault();


            if (edit_popup.classList.contains('closed')) {
                edit_popup.classList.remove('closed');
            } else {
                edit_popup.classList.add('closed');
            }

            this.el.querySelector('.transaction__pop-up__div .transaction__pop-up__body h2').innerHTML = this.feeETH;
            this.el.querySelector('.transaction__pop-up__div .transaction__checkout__time').innerHTML = this.likeTime;

            this.populateOptions();

            clearInterval(this.feeTm);
        });


        adv_options_btn.addEventListener('click', (e) => {
            e.preventDefault();


            if (adv_options_content.classList.contains('hide')) {
                adv_options_content.classList.remove('hide');
                adv_options_btn.classList.add('dropdown-open');

            } else {
                adv_options_content.classList.add('hide');
                adv_options_btn.classList.remove('dropdown-open');
            }
        });

        let radioVal;
        const radios = document.querySelectorAll('input[name="fee_gwei"]');
        const gas_limit = this.el.querySelector('.gas_limit');
        const priority_fee = this.el.querySelector('.priority_fee');
        const radio_parent = Array.from(document.querySelectorAll('.transaction__select__ctn'));
        radios.forEach(radio => {
            radio.addEventListener('click', () => {
                radioVal = radio.value;
                if (radioVal != 'custom') {

                    gas_limit.setAttribute('disabled', 'disabled');
                    priority_fee.setAttribute('disabled', 'disabled');
                    radio_parent[0].classList.add('inactive');
                    radio_parent[1].classList.add('inactive');
                } else {

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

            this.calculateCustomFee();
            this.populateGasEstimate();


            edit_popup.classList.add('closed');

            adv_options_content.classList.add('hide');
            adv_options_btn.classList.remove('dropdown-open');

            this.addFeeInterval();
        });
        Array.from(this.el.querySelectorAll('.cancel_popup_btn, .transaction__pop-up__close')).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();

                edit_popup.classList.add('closed');
                adv_options_content.classList.add('hide');
                adv_options_btn.classList.remove('dropdown-open');

                radioVal = '';
                gas_limit.setAttribute('disabled', 'disabled');
                priority_fee.setAttribute('disabled', 'disabled');
                radio_parent[0].classList.add('inactive');
                radio_parent[1].classList.add('inactive');

                radios.forEach(function (radio, index) {
                    radios[index].checked = false;
                });

                if (this.chosenFee != 'custom') {
                    this.addFeeInterval();
                }
            });
        });

        this.el.querySelector('.tips_btn').addEventListener('click', (e) => {
            e.preventDefault();

        });

        this.el.querySelector('.open_wallet_btn').addEventListener('click', (e) => {
            e.preventDefault();

        });
        this.el.querySelector('.confirm_btn').addEventListener('click', async (e) => {
            clearInterval(this.feeTm);
            const chosenGas = this.gasFees[this.advancedFee];

            if (this.advancedFee == 'custom') {
                const maxFee = this.customPrioFee + this.gasFees.estimatedBaseFee;

                this.keyless.kctrl.setGasForTransaction(this.customGasLimit, maxFee, this.customPrioFee);
            } else {
                const trans = this.keyless.kctrl.getActiveTransaction();
                const gas = await this.keyless.kctrl.estimateGas(trans.data);
                this.keyless.kctrl.setGasForTransaction(gas, chosenGas.suggestedMaxFeePerGas, chosenGas.suggestedMaxPriorityFeePerGas);
            }
            this.keyless._showUI('pin');

            e.target.disabled = true;
            e.preventDefault();

        });

        this.el.querySelector('.reject_btn').addEventListener('click', (e) => {
            e.preventDefault();
            return new ConfirmationDialog(
                this.el,
                `Are you sure you want to reject this transaction?`,
                `Yes`,
                this.rejectConfirmCallback
            );
        });

        const inputs_arrow_gas = document.querySelectorAll('.gas_limit_wrp');

        inputs_arrow_gas.forEach(up_down => {

            let down_arrow = up_down.querySelector('.input_down');
            let up_arrow = up_down.querySelector('.input_up');
            let input_val = up_down.querySelector('input[type="number"]');
            let input_val_total;

            const update_val = (event) => {
                input_val_total = parseInt(input_val.value);
                setTimeout(() => {
                    input_val.value = Math.max(input_val_total, 0);
                    this.calculateCustomFee();
                }, 10)
            };

            input_val.addEventListener('change', update_val);
            input_val.addEventListener('keyup', debounce(update_val, 500));

            down_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseInt(input_val.value);
                input_val_total -= 10;
                input_val.value = Math.max(input_val_total, 0);

                this.calculateCustomFee();
            });
            up_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseInt(input_val.value);
                input_val_total += 10;
                input_val.value = Math.max(input_val_total, 0)
                this.calculateCustomFee();
            });
        });
        const inputs_arrow_fee = document.querySelectorAll('.priority_fee_wrp');

        inputs_arrow_fee.forEach(up_down => {
            let down_arrow = up_down.querySelector('.input_down');
            let up_arrow = up_down.querySelector('.input_up');
            let input_val = up_down.querySelector('input[type="number"]');
            let input_val_total;

            const update_val = (event) => {
                input_val_total = parseFloat(input_val.value);
                setTimeout(() => {
                    input_val.value = Math.max(input_val_total, 0).toFixed(1);
                    this.calculateCustomFee();
                }, 10)
            };



            input_val.addEventListener('change', update_val);
            input_val.addEventListener('keyup', debounce(update_val, 500));

            down_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseFloat(input_val.value);
                input_val_total -= 1;
                input_val.value = Math.max(input_val_total, 0).toFixed(1);

                this.calculateCustomFee();
            });
            up_arrow.addEventListener('click', (event) => {
                event.preventDefault();
                input_val_total = parseFloat(input_val.value);
                input_val_total += 1;
                input_val.value = Math.max(input_val_total, 0).toFixed(1);

                this.calculateCustomFee();
            });
        });


        this.populateData();
        this.populateGasEstimate();
        clearInterval(this.feeTm);
        this.addFeeInterval();
    }

    addFeeInterval() {
        if (this.chosenFee != 'custom') {
            this.feeTm = setInterval(() => this.populateGasEstimate(), 30000);
        }
    }

    populateOptions() {
        this.el.querySelector('.transaction__pop-up__body .option_high').innerHTML = parseInt(this.gasFees['high'].suggestedMaxFeePerGas);
        this.el.querySelector('.transaction__pop-up__body .option_medium').innerHTML = parseInt(this.gasFees['medium'].suggestedMaxFeePerGas);
        this.el.querySelector('.transaction__pop-up__body .option_low').innerHTML = parseInt(this.gasFees['low'].suggestedMaxFeePerGas);
    }

    async calculateCustomFee() {
        const trans = this.keyless.kctrl.getActiveTransaction();
        let likeTime;
        let fee, feeETH;

        if (this.advancedFee == 'custom') {

            likeTime = false;
            const gasLimit = this.el.querySelector('.gas_limit').value;
            const priorityFee = this.el.querySelector('.priority_fee').value;
            fee = (parseInt(this.gasFees.estimatedBaseFee) + parseInt(priorityFee)) * gasLimit;

            feeETH = this.keyless.kctrl.getFeeInEth(fee);
            this.chosenFee = 'custom';
            this.customGasLimit = gasLimit;
            this.customPrioFee = priorityFee;

        } else {
            this.chosenFee = this.advancedFee;

            const chosenGas = this.gasFees[this.advancedFee];

            likeTime = this.getTimeEstimate(this.advancedFee);
            const gas = await this.keyless.kctrl.estimateGas(trans.data);
            fee = (parseInt(this.gasFees.estimatedBaseFee) + parseInt(chosenGas.suggestedMaxPriorityFeePerGas)) * gas;
            feeETH = this.keyless.kctrl.getFeeInEth(fee);
        }

        this.el.querySelector('.transaction__pop-up__div .transaction__pop-up__body h2').innerHTML = formatXDecimals(feeETH, 6);
        this.el.querySelector('.transaction__pop-up__div .transaction__checkout__time').innerHTML = likeTime ? likeTime : 'Unkown Sec';
    }

    async populateGasEstimate() {
        const trans = this.keyless.kctrl.getActiveTransaction();

        if (this.chosenFee == 'custom') {
            this.el.querySelector('.transaction__checkout__time').innerHTML = 'Unknown Sec';

            const chosenGas = this.gasFees['medium'];

            const fee = (parseInt(this.gasFees.estimatedBaseFee) + parseInt(this.customPrioFee)) * this.customGasLimit;
            this.feeETH = this.keyless.kctrl.getFeeInEth(fee);
            this.feeUSD = await this.keyless.kctrl.getBalanceInUSD(this.feeETH);
            let maxFeePerGas = this.keyless.kctrl.getFeeInEth(parseInt(chosenGas.suggestedMaxFeePerGas));

            this.el.querySelector('.transaction__checkout__input h3')
                .innerHTML = this.feeETH + ' ' + this.nativeTokenName +
                '<span> $' + this.feeUSD + '</span>';
            this.el.querySelector('.transaction__checkout h4').innerHTML = '<span>Max Fee: </span>' + maxFeePerGas;

            this.setFeesLoading(false);

            this.populateFees();


        } else {
            this.setFeesLoading(true);

            this.gasFees = await this.keyless.kctrl.estimateFees();
            const gas = await this.keyless.kctrl.estimateGas(trans.data);

            if (this.gasFees) {
                const chosenGas = this.gasFees[this.chosenFee];
                this.likeTime = this.getTimeEstimate(this.chosenFee);
                this.el.querySelector('.transaction__checkout__time').innerHTML = this.likeTime;

                const fee = (parseInt(this.gasFees.estimatedBaseFee) + parseInt(chosenGas.suggestedMaxPriorityFeePerGas)) * gas;
                this.feeETH = this.keyless.kctrl.getFeeInEth(fee);
                this.feeUSD = await this.keyless.kctrl.getBalanceInUSD(this.feeETH);
                const maxFeePerGas = this.keyless.kctrl.getFeeInEth(parseInt(chosenGas.suggestedMaxFeePerGas));

                this.el.querySelector('.transaction__checkout__input h3')
                    .innerHTML = this.feeETH + ' ' + this.nativeTokenName +
                    '<span> $' + this.feeUSD + '</span>';
                this.el.querySelector('.transaction__checkout h4').innerHTML = '<span>Max Fee: </span>' + maxFeePerGas;

                this.populateFees();
            }

            await new Promise((res, rej) => {
                setTimeout(() => { res(); }, 2000);
            });
            this.setFeesLoading(false);
        }

    }

    async populateFees() {
        let totalAmt, totalUSD;
        if (this.isToken) {
            totalAmt = parseFloat(this.feeETH);
            totalUSD = formatXDecimals(parseFloat(this.feeUSD), 4);
        } else {
            totalAmt = parseFloat(this.amt) + parseFloat(this.feeETH);
            totalUSD = formatXDecimals(parseFloat(this.amountUSD) + parseFloat(this.feeUSD), 4);
        }
        this.el.querySelector('.transaction__checkout__total h3').innerHTML =
            totalAmt + ' ' + this.nativeTokenName + '<span>$' + totalUSD + '</span>';

        this.el.querySelector('.transaction__checkout__total h4').innerHTML = 'Max amount: ' + totalAmt;
        this.checkCanProceed();
    }

    async populateData() {
        this.nativeTokenName = (await this.keyless.kctrl.getCurrentNativeToken()).toUpperCase();
        const trans = this.keyless.kctrl.getActiveTransaction();
        if (trans) {
            this.keyless.kctrl._setLoading(true);
            await this.populateAmount(trans);
            await this.populateAddresses(trans);
            await this.populateBalance();
            await this.populateAmount(trans);

            this.keyless.kctrl._setLoading(false);
        }

        this.connectionStatus = this.keyless.isConnected();
        const connectionEl = this.el.querySelector('#connection-status');
        const connStatusEl = new ConnectedStatus(connectionEl, this.connectionStatus);
    }

    async populateAddresses(trans) {
        const activeTrans = trans;
        const fromAddress = this.keyless.kctrl.getAccounts().address;
        const fromCont = this.el.querySelector('.transaction__account .transaction__account__address h3');
        fromCont.innerHTML = middleEllipsisMax(fromAddress, 4);
        fromCont.parentNode.querySelector('.hover-info--1').innerText = fromAddress;
        const isSafleId = await this.keyless.kctrl.getSafleIdFromAddress(activeTrans.data.to);
        let toAddress = activeTrans.data.to;

        const nativeToken = await this.keyless.kctrl.getCurrentNativeToken();

        let decodedData = {};
        if (activeTrans.hasOwnProperty('data') && activeTrans.data.hasOwnProperty('data') && activeTrans.data.data && activeTrans.data.data.length > 0 && activeTrans.data.hasOwnProperty('to')) {
            let chain = this.keyless.getCurrentChain();
            const rpcURL = chain.chain.rpcURL;
            decodedData = await decodeInput(activeTrans.data.data, rpcURL, activeTrans.data.to);
            this.tokenValue = decodedData.value;
            this.isToken = true;
            this.decodedData = decodedData;
            toAddress = decodedData?.recepient;
        }

        const tokenName = this.isToken ? decodedData?.tokenSymbol : nativeToken.toUpperCase();
        const tokenLogo = this.isToken ? this.keyless.kctrl.getTokenIcon({ tokenAddress: activeTrans.data.to }) : this.keyless.kctrl.getTokenIcon(nativeToken);

        if (this.isToken) {
            this.el.querySelector('#native-token-balance').innerHTML = tokenName;
        } else {
            this.el.querySelector('#native-token-balance').innerHTML = this.nativeTokenName;
        }
        this.el.querySelector('#send_icon').src = tokenLogo;
        this.el.querySelector('#send_name').innerHTML = `SEND ${tokenName == undefined ? 'Token' : tokenName}`;

        const toCont = this.el.querySelector('.transaction__account .transaction__account__user h3');
        toCont.innerHTML = isSafleId ? isSafleId : middleEllipsisMax(toAddress, 4);
        toCont.parentNode.querySelector('.hover-info--1').innerText = toAddress;
    }

    async populateBalance() {
        if (this.isToken) {
            this.balance = await this.keyless.kctrl.getWalletBalance(this.keyless.kctrl.getAccounts().address, true, 5);

            const activeTrans = this.keyless.kctrl.getActiveTransaction();
            const fromAddress = this.keyless.kctrl.getAccounts().address;
            try {
                const balance = await this.keyless.kctrl.getTokenBalance(activeTrans.data.to, fromAddress);
                this.tokenBalance = balance / Math.pow(10, parseInt(this.decodedData.decimals));
                this.el.querySelector('.transaction__balance__span').innerHTML = (this.tokenBalance).toFixed(parseInt(this.decodedData.decimals));
            } catch (e) {
            }
        } else {
            this.balance = await this.keyless.kctrl.getWalletBalance(this.keyless.kctrl.getAccounts().address, true, 5);

            this.el.querySelector('.transaction__balance__span').innerHTML = this.balance;
        }
    }

    async populateAmount(trans) {
        const amt = trans.data?.value || 0;
        const amtSend = this.keyless.kctrl.web3.utils.fromWei(amt.toString(), 'ether');
        if (this.isToken) {
            this.amt = this.tokenValue;
            this.el.querySelector('.transaction__send .transaction_amount').value = (this.amt).toFixed(parseInt(this.decodedData.decimals));

            if (parseFloat(this.tokenBalance) < (parseFloat(this.amt) || parseFloat(this.balance) < parseInt(this.feeETH))) {
                this.el.querySelector('.transaction__send').classList.add('low-balance');
            } else {
                this.el.querySelector('.transaction__send').classList.remove('low-balance');
            }

            this.amountUSD = formatMoney(await this.keyless.kctrl.getTokenBalanceInUSD(this.amt, this.decodedData.tokenSymbol));
            this.el.querySelector('.transaction__send .balance-usd').innerHTML = '$' + this.amountUSD;
        } else {
            this.amt = amtSend;
            this.el.querySelector('.transaction__send .transaction_amount').value = this.amt;
            if (parseFloat(this.balance) < (parseFloat(this.amt) + parseInt(this.feeETH))) {
                this.el.querySelector('.transaction__send').classList.add('low-balance');
            } else {
                this.el.querySelector('.transaction__send').classList.remove('low-balance');
            }

            this.amountUSD = formatMoney(await this.keyless.kctrl.getBalanceInUSD(this.amt));
            this.el.querySelector('.transaction__send .balance-usd').innerHTML = '$' + this.amountUSD;
        }
    }

    setFeesLoading(flag) {
        if (flag) {

            this.el.classList.add('fee_loading');
            this.checkCanProceed();
        } else {

            this.el.classList.remove('fee_loading');
            this.checkCanProceed();
        }
    }
    setProceedActive(flag) {
        if (flag) {
            this.el.querySelector('.confirm_btn').removeAttribute('disabled');
        } else {
            this.el.querySelector('.confirm_btn').setAttribute('disabled', 'disabled');
        }
    }

    rejectConfirmCallback = () => {
        clearInterval(this.feeTm);
        this.keyless.kctrl.activeTransaction.reject({
            message: 'User rejected the transaction',
            code: 4200,
            method: 'User rejected'
        });
        this.keyless._hideUI();
    }

    checkCanProceed() {
        if (this.isToken) {
            if ((parseFloat(this.balance) < parseFloat(this.feeETH)) || (parseFloat(this.tokenBalance) < parseFloat(this.tokenValue))) {
                this.setProceedActive(false);
            } else {
                this.setProceedActive(true);
            }
        } else {
            if (parseFloat(this.balance) < (parseFloat(this.amt) + parseFloat(this.feeETH))) {
                this.setProceedActive(false);
            } else {
                this.setProceedActive(true);
            }
        }
    }

    getTimeEstimate(kind) {
        if (!kind) {
            return;
        }
        let chainId = (this.keyless.getCurrentChain()).chain.chainId;


        return txEstimates.hasOwnProperty(chainId) ? txEstimates[chainId][kind] : 'Unknown Sec';
    }

    render() {

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
            <h3 id="send_name">SEND ${this.nativeTokenName}</h3>
            <div class="transaction__send__flex">
                <img src="${tokenIcon}" alt="ETH Icon" id="send_icon">
                <div>
                    <input type="number" value='' readonly class="transaction_amount">
                    <div class="h3 balance-usd">$0</div>
                </div>
            </div>
        </div>

        <div class="transaction__balance">
            <h3><span id="native-token-balance">${this.nativeTokenName}</span> Balance : <span class="transaction__balance__span">3.0120</span></h3>
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
                            <div class="transaction__pop-up__body--flex-fee_div">
                                <h2>0.000823</h2>
                            </div>
                        </div>
                        <div class="transaction__pop-up__body--flex">
                            <div style="width: 100%">
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
                                        Maximum amount of gas “>= 21000”
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
                                        Prioritize your tx “expressed in Gwei”
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
                        <a href="#" class='tips_btn' style="display:none">Tips & tricks for beginners?</a>
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