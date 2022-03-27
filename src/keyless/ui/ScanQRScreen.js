import logoImg from './../images/logo.svg';
import closeImg from './../images/close.png';
import qrIcon from './../images/qr-code.svg';
import UIScreen from '../classes/UIScreen';



class ScanQRScreen extends UIScreen {

    onShow(){
        // on close
        this.el.querySelector('.close').addEventListener('click', () => {
            this.keyless._hideUI();
        });
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
          <img src="${qrIcon}" alt="QR CODE">
        </div>

    </div>`
    }

}

export default ScanQRScreen;