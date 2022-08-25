
import networkImg from './../../images/network-icon.svg';
import network2 from './../../images/network-2.svg'
import network3 from './../../images/network-3.svg'
import network4 from './../../images/network-4.svg'
import network5 from './../../images/network-5.svg'
import network6 from './../../images/network-6.svg'

import { maxChars } from '../../helpers/helpers';

let dropdownCounter = 0;

class AddressDropdown {
    initial;
    opened = false;
    onChangeHandler = false;

    constructor( el, extra_class, extra_option_class, options, nativeToken='ETH', initialValue = false  ){

        this.nativeToken = nativeToken;
        this.extraOptionClass = extra_option_class;        
        this.parentEl = el;
        this.extraClass = extra_class;
        this.options = options;
        this.initial = options?.length > 0 ? options.find(item => item.label === initialValue) : false;

        this.index = ++dropdownCounter;
        this.opContClass = 'd_cont_'+this.index;

        this.el = document.createElement('div');
        this.el.innerHTML = this.render();
        this.parentEl.appendChild( this.el );

        setTimeout( () => this.onInit(), 200 );
    }
    update( options, nativeToken, initialValue ){
        this.nativeToken = nativeToken;
        this.options = options;
        this.initial = options?.length && initialValue ? options.find(item => item.address === initialValue) : false;
        
        this.el.innerHTML = this.render();
        setTimeout( () => this.onInit(), 200 );
    }
    onInit(){
        this.el.querySelector('.dropdown'+this.index ).addEventListener('click', ( e ) => {
            this.el.querySelector( '.'+this.opContClass ).classList.toggle('d--none');
            this.opened = true;
            setTimeout( () => this.handleOutClick(), 10 );
        }, false );

        Array.from( this.el.querySelectorAll('.dd_option') ).forEach( ( el ) => {
            el.addEventListener('click', ( e ) => {
                const idx = parseInt( e.currentTarget.getAttribute('data-option') );
                this.setOption( idx );
            }, false );
        })
    }

    setOptions( options ){
        this.options = options;
        this.el.querySelector( '.'+this.opContClass ).innerHTML = `
        ${ this.options.length > 0 && this.options.map( ( item, idx ) => {
            return `<div class="dd_option" data-option="${idx}">
                        <div>
                            <img src="${networkImg}" alt="Network Icon">
                            <h3 title="${item?.longLabel || ''}">${item.label}</h3>
                        </div>
                        <div>
                            <h3>${ maxChars( item.balance, 10 ) } <span class="c--dark">${ this.nativeToken }</span></h3>
                        </div>
                    </div>`
        }) }`;

        Array.from( this.el.querySelectorAll('.dd_option') ).forEach( ( el ) => {
            el.addEventListener('click', ( e ) => {
                const idx = parseInt( e.currentTarget.getAttribute('data-option') ); 
                this.setOption( idx );
            }, false );
        })
    }

    setOption( idx ){
        if( this.options[ idx ] ){
            this.activeOption = this.options[ idx ];
            this.opened = false;
            this.el.querySelector( '.'+this.opContClass ).classList.add('d--none');
            this.el.querySelector('.title_label h3').innerHTML = this.activeOption.label;
            this.el.querySelector('.balance h3').innerHTML = maxChars( this.activeOption.balance, 10 ) + ' <span class="c--dark">'+this.nativeToken+'</span>';
            this.triggerChange( idx, this.options[ idx ] );
        }
    }

    setLoading( flag ){
        if( flag ){
             this.el.querySelector('.dropdown'+this.index ).classList.add('loading');
        } else {
             this.el.querySelector('.dropdown'+this.index ).classList.remove('loading');
        }
    }

    triggerChange( idx, option ){
        this.onChangeHandler != false && this.onChangeHandler.apply( this, [ idx, option ] );
    }

    onChange( fn ){
        this.onChangeHandler = fn;
    }

    handleOutClick(){
        const handler = ( e ) => {
            if( this.el.contains( e.target) ){
                window.removeEventListener('click', handler, false );
                return;
            }
            const opCont = this.el.querySelector( '.'+this.opContClass );
            if( !opCont.classList.contains('d--none') ){
                opCont.classList.add('d--none');
                this.opened = false;
            }
            window.removeEventListener('click', handler, false );
        };
        window.addEventListener('click', handler, false );
    }

    render(){
        return `<div class="dropdown_default dropdown_address ${this.extraClass} dropdown${this.index}">
            <div class="title_label" style="justify-content: space-between;width: 100%;">
                <div>
                    <img class="title_icon" src="${networkImg}" alt="Network Icon">
                    <h3>${ this.initial? this.initial?.label : this.options[0]?.label }</h3>
                </div>
                <div class="balance">
                    <h3>${ maxChars( this.initial? this.initial?.balance : this.options[0]?.balance || 0, 10 ) } <span class="c--dark">${ this.nativeToken }</span></h3>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="svg-inline--fa fa-angle-down fa-w-10" width="16" height="10" xmlns="http://www.w3.org/2000/svg">
                <path d="m8 10 .88-.843L16 2.316 14.241 0 8 5.998 1.759 0 0 2.316A277265.12 277265.12 0 0 0 8 10z" fill="#CBD7E9" fill-rule="nonzero"/>
            </svg>
                </div>
            </div>
            
        </div>
        <div class="dropdown__content ${this.extraOptionClass} ${this.opContClass} d--none">
        ${ this.options.length > 0 && this.options.map( ( item, idx ) => {
            return `<div class="dd_option" data-option="${idx}">
                        <div>
                            <img src="${networkImg}" alt="Network Icon">
                            <h3 title="${item?.longLabel || ''}">${item.label}</h3>
                        </div>
                        <div>
                            <h3>${ maxChars( item.balance, 10 ) } <span class="c--dark">${ this.nativeToken }</span></h3>
                        </div>
                    </div>`
        }) }        
        </div>`

    }
}

export default AddressDropdown;