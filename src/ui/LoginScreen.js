import UIScreen from './../classes/UIScreen.js';

import closeImg from './../images/close.png';
import logoImg from './../images/logo.png';
import userImg from './../images/user.png';
import lockBtn from './../images/lock.png';
import hiddenIcon from './../images/eye-slash-solid.png';
import visibleIcon from './../images/eye-solid.png';
import config from './../config/config';

class LoginScreen extends UIScreen {


  onInit(){
    this.safleField = this.el.querySelector('.input-id');
    this.saflePass = this.el.querySelector('.input-pass');
    this.error = this.el.querySelector('.error_boundary');
    this.closeBtn = this.el.querySelector('.close');
    this.forgotPassBtn = this.el.querySelector('.forgot-pass');
    this.signinBtn  = this.el.querySelector('.signin-btn');
    this.signupBtn  = this.el.querySelector('.signup-btn');
    this.shPassBtn = this.el.querySelector('.icon-inside .icon-right');

  }

  onShow(){
    // on close
    this.closeBtn.addEventListener('click', () => {
      this.keyless._hideUI();
    });    
    //signup
    this.signupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open( config.SIGNUP_URL, '_blank' );
      
    });
    //forgot-pass
    this.forgotPassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open( config.FORGOTPASS_URL, '_blank' );
      
    });


    // on login
    this.signinBtn.addEventListener('click', async ( e ) => {
      e.preventDefault();
      
      this.error.innerHTML = '';

      try {
        await this.keyless.kctrl.login( this.safleField.value, this.saflePass.value );
        this.safleField.classList.remove('error');
        // this.submitBtn.removeAttribute('disabled');
      } catch( e ){
        
        this.keyless.kctrl._setLoading( false );
        this.error.innerHTML = e.hasOwnProperty('message')? e.message : e.hasOwnProperty('details')? e.details[0].message : e.info[0].message;
        this.safleField.classList.add('error');
      }
    });

    this.shPassBtn.addEventListener('click', ( e ) => {
      e.preventDefault();
      
      if(this.saflePass.value == ''){
        return false;
      }
      if(this.saflePass.type == 'password'){
        this.saflePass.type = 'text';
        e.target.classList.remove('show');
        e.target.classList.add('hide');
        e.target.setAttribute('src',visibleIcon );
      }else{
        this.saflePass.type = 'password';
        e.target.classList.remove('hide');
        e.target.classList.add('show');
        e.target.setAttribute('src',hiddenIcon );
      }
      
    });
  }

  render(){
      return `<div class="login">

      <img class="close" src="${closeImg}" alt="Close Icon">

      <div class="login__header">

        <a class="logo" href="#">
          <img src="${logoImg}" alt="Safle Logo">
        </a>
        
        <h3>Connect via Safle</h3>

      </div>

      <form class="relative" onSubmit="" autocomplete="off" aria-autocomplete="none">
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        <div class="g-recaptcha" data-sitekey="6Lf8HVIaAAAAADBeZl94tnebAST20hEZOHWzQMBD" data-size="invisible"></div>

        <div class="error">
          <div class="error_boundary"></div>
        </div>
        <div class="icon-inside">
          <img class="icon-left" src="${userImg}" alt="User Icon">
          <input class="input-id" type="text" placeholder="Safle ID/Email">
        </div>

        <div class="icon-inside">
          <img class="icon-left icon-left-pass" src="${lockBtn}" alt="Lock Icon">

          <img class="icon-right" src="${hiddenIcon}" alt="Hidden Icon">

          <input class="input-pass" type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;">
        </div>    
        <button class="btn__tp--1 signin-btn" type="submit">Sign In</button>

      </form>

      <div class="login__footer">

        <h4>Don't have an account? 
          <a href="#" class="sign_in signup-btn">Sign Up here </a>
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
        </h4>
        
        <a class="forgot-pass" href="#">Forgot Password</a>

      </div>
      
    </div>`
  }

}

export default LoginScreen;