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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3Manager_1 = __importDefault(require("./web3Manager"));
const widgetManager_1 = __importDefault(require("./widgetManager"));
class Keyless {
    constructor(network) {
        this._config = {
            state: true,
        };
        this._getWidgetCommunication = this._getWidgetCommunication.bind(this);
        this._sendShowWidget = this._sendShowWidget.bind(this);
        this._sendHideWidget = this._sendHideWidget.bind(this);
        this._widgetManagerInstance = new widgetManager_1.default(this.config, this._clearProviderSession);
        this._web3ManagerInstance = new web3Manager_1.default(this.config, this._getWidgetCommunication, this._sendShowWidget, this._sendHideWidget, network);
        this.getWidget = this.getWidget.bind(this);
        this.hideWidget = this.hideWidget.bind(this);
        this.showWidget = this.showWidget.bind(this);
        // this.showKeyless = this.showKeyless.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.destroyOnLogout = this.destroyOnLogout.bind(this);
    }
    _getWidgetCommunication() {
        return __awaiter(this, void 0, void 0, function* () {
            //this._widgetManagerInstance?.showIframe();
            return (yield this._widgetManager.getWidget()).communication;
        });
    }
    _sendShowWidget() {
        //this._widgetManagerInstance?.showIframe();
        this._widgetManager.showWidget();
    }
    _sendHideWidget() {
        //this._widgetManagerInstance?.showIframe();
        this._widgetManager.hideWidget();
    }
    get _widgetManager() {
        return this._widgetManagerInstance;
    }
    get config() {
        return this._config;
    }
    _clearProviderSession() {
        //this._web3Manager.setSelectedAddress('');
    }
    // private
    get _web3Manager() {
        console.log("_web3Manager", this._web3ManagerInstance);
        return this._web3ManagerInstance;
    }
    get web3Provider() {
        console.log("web3Provider");
        console.log("web3Provider", this._web3Manager.provider);
        return this._web3Manager.provider;
    }
    get provider() {
        console.log("provider");
        return this.web3Provider;
    }
    // changeNetwork(network: string){
    //   this._web3Manager.changeNetwork(network);
    // }
    getWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._widgetManager.getWidget();
        });
    }
    showWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            this._widgetManager.showWidget();
        });
    }
    hideWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            this._widgetManager.hideWidget();
        });
    }
    // SDK Methods that could be invoked by the user and handled by the widget
    init(state) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._widgetManager.init(state);
        });
    }
    updateWeb3(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._web3ManagerInstance = new web3Manager_1.default(this.config, this._getWidgetCommunication, this._sendShowWidget, this._sendHideWidget, chainId);
            return this;
        });
    }
    selectChain() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._web3Manager.selectChain();
        });
    }
    getCurrentNetworkTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._web3Manager.getUserTokens();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._web3Manager.disconnetKeyless();
        });
    }
    openDashboard() {
        return this._sendShowWidget();
    }
    destroyOnLogout() {
        this._widgetManagerInstance = null;
        this._web3ManagerInstance = null;
        this._config = null;
    }
    // Population by the dev of SDK callbacks that might be invoked by the widget.
    onLogin(callback) {
        this._widgetManager.setOnLoginCallback(callback);
    }
    // Population by the dev of SDK callbacks that might be invoked by the widget.
    onLogout(callback) {
        this._widgetManager.setOnLogoutCallback(callback, this.destroyOnLogout);
    }
}
exports.default = Keyless;
