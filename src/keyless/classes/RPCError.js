
class RPCError {
    constructor( message, code=4200, method='Unsupported Method' ) {

        return Promise.reject({
            message: message,
            code: code,
            method: method
        });
    }

}

export default RPCError;