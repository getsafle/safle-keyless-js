"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProviderEngine = require("web3-provider-engine");
const CacheSubprovider = require("web3-provider-engine/dist/es5/subproviders/cache.js");
const FixtureSubprovider = require("web3-provider-engine/dist/es5/subproviders/fixture.js");
const FilterSubprovider = require("web3-provider-engine/dist/es5/subproviders/filters.js");
const HookedWalletSubprovider = require("web3-provider-engine/dist/es5/subproviders/hooked-wallet.js");
const NonceSubprovider = require("web3-provider-engine/dist/es5/subproviders/nonce-tracker.js");
const SubscriptionsSubprovider = require("web3-provider-engine/dist/es5/subproviders/subscriptions.js");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");
const query_1 = require("./utils/query");
const getTxGas_1 = require("./utils/getTxGas");
const networks_1 = require("./networks");
class Web3Manager {
    constructor(config, _getWidgetCommunication, _sendShowWidget, _sendHideWidget, rpc) {
        this.config = config;
        this._getWidgetCommunication = _getWidgetCommunication;
        this._sendShowWidget = _sendShowWidget;
        this._sendHideWidget = _sendHideWidget;
        this.rpc = rpc;
        console.log("rpc", rpc);
        this.rpcUrl = this.setNetwork(rpc);
        this.provider = this._initProvider();
    }
    setSelectedAddress(selectedAddress) {
        this._selectedAddress = selectedAddress;
    }
    selectChain() {
        return __awaiter(this, void 0, void 0, function* () {
            this._sendShowWidget();
            const widgetCommunication = yield this._getWidgetCommunication();
            console.log("selectChain", widgetCommunication);
            yield widgetCommunication.selectChain();
        });
    }
    disconnetKeyless() {
        return __awaiter(this, void 0, void 0, function* () {
            const widgetCommunication = yield this._getWidgetCommunication();
            console.log("disconnetKeyless", widgetCommunication);
            yield widgetCommunication.disconnetKeyless();
        });
    }
    getUserTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const widgetCommunication = yield this._getWidgetCommunication();
                console.log("getUserTokens", widgetCommunication);
                const res = yield widgetCommunication.getUserTokens();
                if (res.success) {
                    return res.resp;
                }
                else {
                    return "Unable to fetch user tokens";
                }
            }
            catch (e) {
                console.log(e);
                return e.message;
            }
        });
    }
    setNetwork(network) {
        const newNetwork = (0, networks_1.networkAdapter)(network);
        console.log("newNetwork", newNetwork);
        return newNetwork;
    }
    _initProvider() {
        // don't init the engine twice
        if (this.engine) {
            return this.engine;
        }
        this.engine = new ProviderEngine();
        const query = new query_1.Query(this.engine);
        this.engine.send = (payload, callback) => {
            // Web3 1.0 beta.38 (and above) calls `send` with method and parameters
            if (typeof payload === "string") {
                return new Promise((resolve, reject) => {
                    this.engine.sendAsync({
                        jsonrpc: "2.0",
                        id: 42,
                        method: payload,
                        params: callback || [],
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
            // Web3 1.0 beta.37 (and below) uses `send` with a callback for async queries
            if (callback) {
                this.engine.sendAsync(payload, callback);
                return;
            }
            let result = null;
            console.log("Method", payload.method);
            switch (payload.method) {
                case "eth_request":
                case "eth_requestAccounts":
                    result = this._selectedAddress ? [this._selectedAddress] : [];
                    break;
                case "eth_accounts":
                    result = this._selectedAddress ? [this._selectedAddress] : [];
                    break;
                case "eth_uninstallFilter":
                    break;
                case "eth_request":
                case "personal_listAccounts":
                case "eth_getBalance":
                case "eth_sendTransaction":
                case "eth_getTransactionCount":
                case "eth_getBlockByNumber":
                case "eth_gasPrice":
                case "eth_getTransactionReceipt":
                case "eth_sign":
                    result = this._signature ? [this._signature] : "";
                    break;
                case "eth_call":
                case "eth_estimateGas":
                case "eth_chainId":
                case "net_version":
                case "eth_getEncryptionPublicKey":
                default:
                    var message = `The Safle Web3 object does not support synchronous methods like ${payload.method} without a callback parameter.`;
                    throw new Error(message);
            }
            return {
                id: payload.id,
                jsonrpc: payload.jsonrpc,
                result,
            };
        };
        // cache layer
        this.engine.addProvider(new CacheSubprovider());
        // subscriptions manager
        this.engine.addProvider(new SubscriptionsSubprovider());
        // filters
        this.engine.addProvider(new FilterSubprovider());
        // pending nonce
        this.engine.addProvider(new NonceSubprovider());
        // set default id when needed
        this.engine.addProvider({
            setEngine: (_) => _,
            handleRequest: (payload, next) => __awaiter(this, void 0, void 0, function* () {
                if (!payload.id) {
                    payload.id = 42;
                }
                next();
            }),
        });
        this.engine.addProvider(new HookedWalletSubprovider({
            getAccounts: (cb) => __awaiter(this, void 0, void 0, function* () {
                const widgetCommunication = yield this._getWidgetCommunication();
                console.log("getAccounts:HookedWallet", widgetCommunication);
                widgetCommunication.getAccounts().then((result) => {
                    var _a, _b, _c, _d;
                    console.log(result);
                    let error = null;
                    if (result.success) {
                        this._selectedAddress = (_a = result.resp) === null || _a === void 0 ? void 0 : _a.addresses[0];
                        (_b = this._widgetManagerInstance) === null || _b === void 0 ? void 0 : _b.hideIframe();
                        cb(error, (_c = result.resp) === null || _c === void 0 ? void 0 : _c.addresses);
                    }
                    else {
                        error = result.error;
                        cb(error, (_d = result.error) === null || _d === void 0 ? void 0 : _d.message);
                    }
                });
            }),
            signMessage: (msgParams, cb) => __awaiter(this, void 0, void 0, function* () {
                this._sendShowWidget();
                const widgetCommunication = yield this._getWidgetCommunication();
                console.log("signMessageHooked", widgetCommunication);
                const params = Object.assign(Object.assign({}, msgParams), { messageStandard: "signMessage" });
                widgetCommunication.signData(params).then((result) => {
                    var _a, _b, _c;
                    console.log(result);
                    let error = null;
                    if (result.success) {
                        this._signature = (_a = result.resp) === null || _a === void 0 ? void 0 : _a.sign_resp;
                        // this._sendHideWidget();
                        cb(error, (_b = result.resp) === null || _b === void 0 ? void 0 : _b.sign_resp);
                    }
                    else {
                        error = result.error;
                        cb(error, (_c = result.error) === null || _c === void 0 ? void 0 : _c.message);
                    }
                });
            }),
            processTransaction: (msgParams, cb) => __awaiter(this, void 0, void 0, function* () {
                this._sendShowWidget();
                const widgetCommunication = yield this._getWidgetCommunication();
                console.log("signMessageHooked", widgetCommunication);
                const params = Object.assign(Object.assign({}, msgParams), { messageStandard: "processTransaction" });
                widgetCommunication
                    .processTransaction(msgParams)
                    .then((result) => {
                    console.log(result);
                    let error = null;
                    if (result.success) {
                        //this._signature = result.resp.sign_resp;
                        // this._sendHideWidget();
                        cb(error, result.resp);
                    }
                    else {
                        error = result.error;
                        cb(error, result.resp);
                    }
                });
            }),
            signTransaction: (txParams, cb) => __awaiter(this, void 0, void 0, function* () {
                this._sendShowWidget();
                const widgetCommunication = yield this._getWidgetCommunication();
                const { error, result } = yield widgetCommunication.signTransaction(txParams);
                cb(error, result);
                // setTimeout(() => {
                //   this._sendHideWidget();
                // }, 5000);
            }),
            estimateGas: (txParams, cb) => __awaiter(this, void 0, void 0, function* () {
                const gas = yield (0, getTxGas_1.getTxGas)(query, txParams);
                cb(null, gas);
            }),
            getGasPrice: (cb) => __awaiter(this, void 0, void 0, function* () {
                cb(null, "");
            }),
        }));
        // data source
        if (this.rpcUrl) {
            console.log("RPCURL", this.rpcUrl);
            this.engine.addProvider(new RpcSubprovider({
                // rpcUrl: 'https://polygon-mumbai.infura.io/v3/814228beb1ff4d5991988329e57c349c',
                rpcUrl: this.rpcUrl,
            }));
        }
        else {
            // Handle RPCURL not found.
            console.log("RPC->else", this.rpcUrl);
        }
        this.engine.enable = () => new Promise((resolve, reject) => {
            this.engine.sendAsync({ method: "eth_accounts" }, (error, response) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
        this.engine.isConnected = () => {
            return true;
        };
        this.engine.isKeyless = true;
        this.engine.on("error", (error) => {
            if (error &&
                error.message &&
                error.message.includes("PollingBlockTracker")) {
                //console.warn('If you see this warning constantly, there might be an error with your RPC Node.')
            }
            else {
                console.error(error);
            }
        });
        this.engine.start();
        console.log(this.engine);
        return this.engine;
    }
    clearSubprovider(subproviderType) {
        const subprovider = this.provider._providers.find((subprovider) => subprovider instanceof subproviderType);
        this.provider.removeProvider(subprovider);
        this.provider.addProvider(new subproviderType());
    }
}
exports.default = Web3Manager;
