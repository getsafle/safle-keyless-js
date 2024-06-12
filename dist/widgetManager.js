"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Penpal = __importStar(require("penpal"));
const styles_1 = require("./styles");
const onWindowLoad_1 = require("./utils/onWindowLoad");
const WIDGET_URL = "https://test-keyless-core.getsafle.com/";
const KEYLESS_CONTAINER_CLASS = "safle_keyless-container";
const KEYLESS_IFRAME_CLASS = "safle_keyless-widget-frame";
class WidgetManager {
    constructor(_widgetConfig, _clearProviderSession) {
        this._widgetConfig = _widgetConfig;
        this._clearProviderSession = _clearProviderSession;
        this._widgetUrl = WIDGET_URL;
        this._onLoginCallback = () => { };
        this._onLogoutCallback = () => { };
        this._destroyOnLogout = () => { };
        this.iframe = null;
        WidgetManager._checkIfWidgetAlreadyInitialized();
    }
    static _checkIfWidgetAlreadyInitialized() {
        if (document.getElementsByClassName(KEYLESS_CONTAINER_CLASS).length) {
            console.warn("An instance of Portis was already initialized. This is probably a mistake. Make sure that you use the same Portis instance throughout your app.");
        }
    }
    getWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.widgetInstance) {
                if (!this.widgetPromise) {
                    this.widgetPromise = this._initWidget();
                }
                this.widgetInstance = yield this.widgetPromise;
                //if (this.iframe) this.iframe.style.display = "none";
                console.log(this.widgetInstance);
            }
            return this.widgetInstance;
        });
    }
    showWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.iframe)
                this.iframe.style.display = "block";
        });
    }
    hideWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.iframe)
                this.iframe.style.display = "none";
        });
    }
    _initWidget() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, onWindowLoad_1.onWindowLoad)();
            const style = document.createElement("style");
            style.innerHTML = styles_1.styles;
            const container = document.createElement("div");
            container.className = KEYLESS_CONTAINER_CLASS;
            const widgetFrame = document.createElement("div");
            widgetFrame.id = `safle_keyless-container-${Date.now()}`;
            widgetFrame.className = KEYLESS_IFRAME_CLASS;
            // container.appendChild(widgetFrame);
            // document.body.appendChild(container);
            // document.head.appendChild(style);
            this.iframe = document.createElement("iframe");
            this.iframe.src = this._widgetUrl;
            // this.iframe.style.display = "none";
            this.iframe.style.overflow = "auto"; // Add this line.
            this.iframe.style.height = "770px"; // You may want to adjust this.
            this.iframe.style.width = "360px";
            this.iframe.style.right = "10px";
            this.iframe.style.top = "10px";
            this.iframe.style.borderRadius = "20px";
            this.iframe.style.position = "absolute";
            document.body.appendChild(this.iframe);
            try {
                const connection = Penpal.connectToChild({
                    debug: true,
                    iframe: this.iframe,
                    methods: {
                        parentMethod: (res) => {
                            console.log("Parent method called!", res);
                            //parseResult(res);
                            if (res.disconnetKeyless && this.iframe) {
                                console.log("disconnecting keyless");
                                this.iframe.style.display = "none";
                                document.body.removeChild(this.iframe);
                            }
                            if (res.closeWidget && this.iframe) {
                                console.log("closing widget");
                                if (res.resp.isConnected) {
                                    this.iframe.style.display = "none";
                                }
                                else {
                                    document.body.removeChild(this.iframe);
                                }
                            }
                            if (res.loginSuccess && res.isFirstLogin) {
                                console.log("IN WIDGET MANAGER ", res.data[0], `${Number(res.currentChain.chainId)}`);
                                this._onLogin(res.data[0], `${Number(res.currentChain.chainId)}`);
                            }
                            if (res.isLogout) {
                                this._onLogout();
                            }
                            return res;
                        },
                    },
                });
                const communication = yield connection.promise;
                console.log("commmunication", communication);
                // communication.setSdkConfig(this._widgetConfig);
                // connection.iframe.style.overflow = 'auto'; // Add this line.
                // connection.iframe.style.height = '770px'; // You may want to adjust this.
                // connection.iframe.style.width = '360px';
                // connection.iframe.style.right = '10px';
                // connection.iframe.style.top = '10px';
                // connection.iframe.style.position = 'absolute';
                // communication.init(true);
                return { communication, widgetFrame };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    // parseResult(data){
    //   if(data.type=='hget'){
    //   }
    // }
    // Population by the dev of SDK callbacks that might be invoked by the widget
    setOnLoginCallback(callback) {
        this._onLoginCallback = callback;
    }
    setOnLogoutCallback(callback, destroyCallback) {
        this._onLogoutCallback = callback;
        this._destroyOnLogout = destroyCallback;
    }
    // SDK methods that could be invoked by the user and handled by the widget
    //   async showKeyless() {
    //     const widgetCommunication = (await this.getWidget()).communication;
    //     console.log(widgetCommunication);
    //     return widgetCommunication.showKeyless(this._widgetConfig);
    //   }
    // async signMessage(messageToSign: string, from: string ) {
    //     const widgetCommunication = (await this.getWidget()).communication;
    //     return widgetCommunication.signMessage(messageToSign, from);
    // }
    init(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const widgetCommunication = (yield this.getWidget()).communication;
            widgetCommunication.init(state).then((res) => {
                console.log("initinit", res);
            });
        });
    }
    showIframe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.iframe)
                this.iframe.style.display = "none";
            if (this.iframe)
                this.iframe.style.display = "block";
        });
    }
    hideIframe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.iframe)
                this.iframe.style.display = "none";
        });
    }
    _onLogin(walletAddress, chainId) {
        if (this._onLoginCallback) {
            this._onLoginCallback(walletAddress, chainId);
        }
    }
    _onLogout() {
        if (this._onLogoutCallback) {
            this._onLogoutCallback();
        }
        if (this._destroyOnLogout)
            this._destroyOnLogout();
    }
}
exports.default = WidgetManager;
