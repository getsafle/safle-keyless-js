"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
class Query {
    constructor(provider) {
        this.provider = provider;
    }
    getBlockByNumber(blockNumber, fullTransaction) {
        return this.sendAsync('eth_getBlockByNumber', blockNumber, fullTransaction);
    }
    getCode(address, blockNumber = 'latest') {
        return this.sendAsync('eth_getCode', address, blockNumber);
    }
    estimateGas(txParams) {
        return this.sendAsync('eth_estimateGas', txParams);
    }
    sendAsync(methodName, ...args) {
        return new Promise((resolve, reject) => {
            this.provider.sendAsync({
                id: 42,
                jsonrpc: '2.0',
                method: methodName,
                params: args,
            }, (error, response) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
}
exports.Query = Query;
