
import iconDanger from './../../images/icon_danger.svg'

class ConfirmationDialog {
    el;
    parentEl;
    callback;

    confirmBtnText = "Ok";
    phraseText = "Are you sure?";

    constructor( el, phraseText, confirmBtnText, callback ){
        this.parentEl = el;
        this.callback = callback;

        if (phraseText) this.phraseText = phraseText;
        if (confirmBtnText) this.confirmBtnText = confirmBtnText;

        this.el = document.createElement('div');
        this.el.innerHTML = this.render();
        this.parentEl.appendChild( this.el );

        setTimeout( () => this.onInit(), 200 );
    }

    onInit(){
        const mainElement = this.el;

        mainElement.querySelector('.confirmation-btn' ).addEventListener('click', ( e ) => {
            setTimeout( () => this.callback(), 10 );
        }, false );

        mainElement.querySelector('.cancel-btn' ).addEventListener('click', ( e ) => {
            setTimeout( () => mainElement.remove(), 10 );
        }, false );
    }

    render(){
        return (
        `<div class="dialog-container">
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <img class="icon" src="${iconDanger}" alt="Danger Icon">
                <h3>Confirm action</h3>
                <div class="dialog-message">
                    ${this.phraseText}
                </div>
                <div class="cta-container">
                    <button class="btn__tp--1 confirmation-btn">${this.confirmBtnText}</button>
                    <button class="btn__tp--2 cancel-btn">Cancel</button>
                </div>
            </div>
        </div>`)

    }
}

export default ConfirmationDialog;