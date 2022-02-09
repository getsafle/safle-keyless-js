import './scss/index.scss';
import LoginScreen from './ui/login';
import { inlineS } from './helpers/helpers';

class KeylessProvider {
    
    send( opts ) {
        console.log( 'SEND', opts );
    }
    sendAsync(  opts ) {
        console.log( 'SEND', opts );
    }
    on( ev, fn ) {
        console.log('event on', ev );
    }
}

class KeylessWeb3 {
    root = false;
    provider = false;

    constructor(){
        this.provider = new KeylessProvider();
    }

    login(){
        const screen = new LoginScreen();

        this.root = document.createElement('div');
        this.root.style.cssText = inlineS( {
            'z-index': 10000,
            'position': 'absolute',
            'width': '100vw',
            'height': '100vh',
            'left': 0, 
            'top': 0,
            'display': 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
            'justify-content': 'center'
        });
        this.root.innerHTML = screen.render();
        this.root.querySelector('.close').addEventListener('click', () => this.hide() );

        document.body.appendChild( this.root );
    }

    hide(){
        //destroy

        this.root.parentNode.removeChild( this.root );
    }

}

//export for web 
window.KeylessWeb3 = KeylessWeb3;
export default KeylessWeb3;