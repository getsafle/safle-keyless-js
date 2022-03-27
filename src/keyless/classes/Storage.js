const CryptoJS = require('crypto-js');

let Storage = {
    key: 'state_extension_Storage',
    localKey: 'localState_extension_Storage',
    state: null,
    localState: null,
    
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
        //localStorage.setItem( Storage.key, cont );
        this.commit('state', Storage.state );
    },

    getLocalState: function(){
        let cont = this.load('local');
        if( !cont ){
            cont = {};
        }
        Storage.localState = cont;
        return Storage.localState;
    },

    saveLocalState: function( state ){
        Storage.localState = { ...Storage.localState, ...state };
        console.log( 'LOCALSTATE', Storage.localState );

        this.commit( 'local', Storage.localState );
    },
    clearLocalState: function(){
        Storage.localState = {};

        this.commit( 'local', Storage.localState );
    },

    clearStateKeys: function( keyPrefixes ){        
        let keys = Object.keys( Storage.state );
        let newState = Object.values( Storage.state ).reduce( ( acc, curr, key ) => {
            let shouldSkip = false;
            for( var i in keyPrefixes ){
                if( keys[ key ].indexOf( keyPrefixes[i] ) != -1 ){
                    shouldSkip = true;
                }
            }
            if( !shouldSkip ){
                acc[ keys[key] ] = curr;
            } else {
                console.log('delete key ', keys[key] );
            }

            return acc;
        }, {} );
        
        // console.log( 'new state', remaining );
        this.commit( 'local', newState );
    },

    INITIAL_STATE: {
        currentScreen: 'login-screen',
        currentController: 'index_controller',
        locked: false,
        wallets: false
    },

    commit: function( place, obj ){
        const sol = process.env.WALLET_WORD_SPLIT;
        const k = place =='local'? Storage.localKey : Storage.key;

        const buff = CryptoJS.AES.encrypt( JSON.stringify( obj ), sol ).toString();
        localStorage.setItem( k, buff );
        console.log('saved state');
    },
    load: function( place ){
        const k = place =='local'? Storage.localKey : Storage.key;

        const sol = process.env.WALLET_WORD_SPLIT;
        const buff = localStorage.getItem( k ) || null;
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