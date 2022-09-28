import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import qrIcon from './../images/qr-code.svg';
import UIScreen from '../classes/UIScreen';
import QRCode from 'qrcode';

class ScanQRScreen extends UIScreen {

    onShow(){
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });

        this.generateQR();
    }

    async generateQR(){
        let url;

        if( this.keyless.kctrl.activeTransaction ){
            const data = JSON.stringify( this.keyless.kctrl.activeTransaction );
            url = await QRCode.toDataURL( data );
            this.el.querySelector('.mobile-or__code img').setAttribute('src', url );
        } else if( this.keyless.kctrl.activeSignRequest ){
            const data = JSON.stringify( this.keyless.kctrl.activeSignRequest );
            url = await QRCode.toDataURL( data );
            this.el.querySelector('.mobile-or__code img').setAttribute('src', url );
        } else {
            this.keyless._hideUI();
        }
    }
    

    render(){

        return `<div class="mobile-or">

        <img class="close" src="${closeImg}" alt="Close Icon">

        <div class="mobile-or__header">

            <a class="logo" href="#">
              <img src="${logoImg}" alt="Safle Logo">
            </a>

            <h3>Scan QR Code with a Safle Wallet</h3>

        </div>

        <div class="mobile-or__code">
          <img src="" alt="QR CODE">
        </div>

    </div>`
    }

}

export default ScanQRScreen;