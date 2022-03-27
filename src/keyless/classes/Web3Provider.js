import EventEmitter from './EventEmitter';
import RPCError from './RPCError';

class Web3Provider extends EventEmitter {
    connected = false;

    constructor( config ){
        super();
        
        this.keyless = config?.keylessInstance;
        console.log('evt emitter');

        // this.emit('connected ');
        // return new Proxy( this, {
        //     get: async function( e ){
        //         console.log( 'ok' );

        //         return Promise.resolve({ ok: true });
        //     }
        // });
    }

    async request( e ){
        console.log('from web provider: ', e );
        if( !e.method ){
            return new RPCError('Method not described');
        } 
        
        switch( e.method ){

            case 'eth_request':
            case 'eth_requestAccounts':
            case 'personal_listAccounts':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }

                const addrs = this.keyless.kctrl.getAccounts();
                if( !addrs ){
                    throw new RPCError('Please connect to DAP');

                    return Promise.reject( addr );
                }
                return Promise.resolve( [ addrs ] );

            break;

            case 'eth_getBalance':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }
                return Promise.resolve( 1000000000000000000 );
            break;

            default:
                console.log('default');

            break;
        }
    }
}

export default Web3Provider;