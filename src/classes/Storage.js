const CryptoJS = require('crypto-js');

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
        //let cont = JSON.stringify( Storage.state );
        //sessionStorage.setItem( Storage.key, cont );
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
        const sol = process.env.WALLET_WORD_SPLIT || 'safle241241024';
        const k = Storage.key;

        const buff = CryptoJS.AES.encrypt( JSON.stringify( obj ), sol ).toString();
        sessionStorage.setItem( k, buff );
        console.log('saved state');
    },
    load: function( place ){
        const k = Storage.key;

        const sol = process.env.WALLET_WORD_SPLIT || 'safle241241024';
        const buff = sessionStorage.getItem( k ) || null;
        if( !buff ){
            return false;
        }
        let dec;
        try {
            dec = CryptoJS.AES.decrypt( buff, sol ).toString( CryptoJS.enc.Utf8 );
        } catch( e ){
            console.log( 'error', e );
            dec = false;
        }
        return JSON.parse( dec );
    }
}

export default Storage;