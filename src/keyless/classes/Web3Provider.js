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

                const addrs = await this.keyless.kctrl.getAccounts();
                if( !addrs ){
                    throw new RPCError('Please connect to DAP');
                    // return Promise.reject( addr );
                }
                return Promise.resolve( [ addrs.address ] );

            break;

            case 'eth_getBalance':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }
                // const addr = this.keyless.kctrl.getAccounts();
                return this.keyless.kctrl.getWalletBalance( e.params[0] );
            break;

            case 'eth_sendTransaction':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }
                return this.keyless.kctrl.sendTransaction( e.params[0] );     
            break;

            case 'eth_getTransactionCount':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }
                return this.keyless.kctrl.web3.eth.getTransactionCount( e.params[0] );
            break;

            case 'eth_getBlockByNumber':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }
                return this.keyless.kctrl.web3.eth.getBlock( e.params[0], e.params[1] );
            break;

            case 'eth_gasPrice':
                return this.keyless.kctrl.web3.eth.getGasPrice();
            break;

            case 'eth_getTransactionReceipt':
                return {
                    transactionHash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
                }
            break;

            case 'eth_sign':
                if( !this.keyless._loggedin ){
                    return new RPCError('Please login in order to use keyless', 4200, 'Unauthorized');
                }
                return this.keyless.kctrl.signTransaction( e.params[0], e.params[1] );
            break;

            default:
                console.log('default');

            break;
        }
    }
}

export default Web3Provider;