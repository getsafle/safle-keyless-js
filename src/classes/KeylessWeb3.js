import Web3Provider from './Web3Provider';
import { inlineS } from './../helpers/helpers';
import config from './../config/config';
import KeylessController from './KeylessController';
import Storage from './Storage';
import RPCError from './RPCError';

class KeylessWeb3 {
    root = false
    _zIndex = false

    _loggedin = false
    _connected = false
    _activeChain = false
    _activeScreen = false
    _web3 = false
    vault = {}
    provider = false

    constructor(config) {
        this.allowedChains = config.blockchain;

        this.provider = new Web3Provider({ keylessInstance: this });
        this.kctrl = new KeylessController(this, this.allowedChains);
        const { chainId } = this.getCurrentChain();
        this._connected = false;
    }

    login() {
        const { chainId } = this.getCurrentChain();

        if (this._loggedin) {
            this.provider.emit('chainChanged', chainId);
            this.provider.emit('accountsChanged', [this.kctrl.wallets[this.kctrl.activeWallet].address]);
            this.provider.emit('connect', { chainId });
            this.provider.emit('login successful', [this.kctrl.wallets[this.kctrl.activeWallet].address]);

            this.openDashboard();
        } else {
            this._showUI('login');
        }

        return {
            error: false
        }
    }

    async isLoggedIn() {
        if (!this._loggedin) {
            const { vault, decriptionKey } = Storage.getState() || {};

            if (!vault || !decriptionKey) {
                return false;
            } else {
                await this.kctrl.loadVault();
                this._loggedin = true;
            }
        }
        return true
    }

    openDashboard() {
        if (!this._connected) {
            throw new RPCError('Provider not connected');
        }
        if (!this._loggedin) {
            throw new RPCError('Please login first!');
        }
        this._showUI('dashboard');
    }

    sendTransaction() {
        if (!this._loggedin) {
            throw new Error('Please login first!');
        }
        this._showUI('send');
    }

    selectChain() {
        if (!this._loggedin) {
            throw new Error('Please login first!');
        }
        this._showUI('SwitchChain');

    }
    disconnect() {
        this.kctrl.logout();
        this._loggedin = false;
        this._connected = false;

        setTimeout(() => this.provider.emit('disconnect', {}), 100);
    }

    switchNetwork(selectedChainId) {
        this._activeChain = selectedChainId;
        this.kctrl.switchNetwork(this._activeChain);
        this.provider.emit('chainChanged', selectedChainId);
    }
    switchWallet(wid) {
        this.kctrl.activeWallet = wid;
        this.provider.emit('accountsChanged', [this.kctrl.wallets[this.kctrl.activeWallet].address]);
        Storage.saveState({ activeWallet: wid });
    }

    setNetwork() {

    }

    getSupportedNetworks() {

    }

    isConnected() {
        return this._connected;
    }

    getCurrentChain() {
        const storage = Storage.getState();
        this._activeChain = this._activeChain || storage.chainId || undefined;
        if (!this._activeChain) {
            this._activeChain = 1;
        }
        const chain = this.allowedChains.find(e => e.chainId == this._activeChain);



        return {
            chainId: chain.chainId,
            chain
        }
    }
    getCurrentNativeToken() {
        const currChain = this.getCurrentChain();

        return currChain.chain.symbol;
    }
    async getNativeTokenFor(chainId) {
        let activeChain = this.allowedChains.find(e => e.chainId == chainId);

        return activeChain.symbol.toLowerCase();
    }
    async getCurrentNetworkTokens() {
        try {

            return await this.kctrl.getTokens()
        } catch (e) {
            throw e
        }
    }

    injectScripts() {
        const el = document.createElement('div');
        el.className = 'g-recaptcha';
        el.setAttribute('data-sitekey', config.RECAPTCHA_SITE_KEY);
        el.setAttribute('data-size', 'invisible');
        document.body.appendChild(el);
        var script = document.createElement('script');
        script.setAttribute('async', true);
        script.setAttribute('defer', true);
        script.src = "https://www.google.com/recaptcha/api.js";
        document.head.appendChild(script);
    }


    async _showUI(screenName) {
        this._hideUI();

        const className = screenName.slice(0, 1).toUpperCase() + screenName.slice(1) + 'Screen';
        this._activeScreen = await this._getInstance(className);


        this.root = document.createElement('div');
        this.root.setAttribute('class', config.KEYLESS_UI_CLASSNAME);
        this.root.style.cssText = inlineS({
            'z-index': this._getZIndex(),
            'position': 'fixed',
            'width': '100vw',
            'height': '100vh',
            'left': 0,
            'top': 0,
            'display': 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
            'justify-content': 'center'
        });
        this.root.innerHTML = this._activeScreen.render();
        document.body.appendChild(this.root);
        this._activeScreen.setKeylessInstance(this);
        this._activeScreen.setView(this.root);
        this._activeScreen.onInit();

        setTimeout(() => this._activeScreen.onShow(), 40);
    }
    async _hideUI() {
        if (this._activeScreen) {
            await this._activeScreen.onBeforeHide();
            try {
                document.body.removeChild(this._activeScreen.el);
            } catch (e) {

            }
            this._activeScreen = null;
        }

    }

    async _getInstance(className) {
        let inst = await import(`./../ui/${className}.js`);
        return new inst.default;
    }

    _getZIndex() {
        this._zIndex = Array.from(document.querySelectorAll('body *')).reduce((acc, el) => {
            const num = parseFloat(window.getComputedStyle(el, null).zIndex);
            return !isNaN(num) ? Math.max(acc, num) : acc;
        }, 0);

        return this._zIndex + 10;
    }

}

export default KeylessWeb3;