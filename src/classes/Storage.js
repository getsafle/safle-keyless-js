import CryptoJS from 'crypto-js';
import config from './../config/config';

let Storage = {
    key: 'safle_90852380598230958203958',
    state: null,
    
    getState: function(){
        if( !this.state ){
            let cont = this.load('state');
            if( !cont ){
                cont = Storage.INITIAL_STATE;
            }    
            Storage.state = cont;
        }
        return Storage.state;
    },

    saveState: function( data ){
        Storage.state = { ...Storage.state, ...data };
        this.commit('state', Storage.state );
    },

    clear: function(){
        this.state = Storage.INITIAL_STATE;
        sessionStorage.removeItem( Storage.key );
    },

    INITIAL_STATE: {
       vault: null,
       decriptionKey: null
    },

    commit: function( place, obj ){
        const sol = config.WALLET_WORD_SPLIT || 'safle241241024';
        const k = Storage.key;

        const buff = CryptoJS.AES.encrypt( JSON.stringify( obj ), sol ).toString();
        sessionStorage.setItem( k, buff );
        
    },
    load: function( place ){
        const k = Storage.key;

        const sol = config.WALLET_WORD_SPLIT || 'safle241241024';
        const buff = sessionStorage.getItem( k ) || null;
        if( !buff ){
            return false;
        }
        let dec;
        try {
            dec = CryptoJS.AES.decrypt( buff, sol ).toString( CryptoJS.enc.Utf8 );
        } catch( e ){
            
            dec = false;
        }
        return JSON.parse( dec );
    }
}

export default Storage;