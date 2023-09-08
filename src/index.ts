import { INetwork, ISDKConfig, IWidget } from "./interfaces";
import Web3Manager from "./web3Manager";
import WidgetManager from "./widgetManager";

export default class Keyless {
  private _widgetManagerInstance?: WidgetManager | null;
  private _web3ManagerInstance?: Web3Manager | null;
  private _config?: ISDKConfig | null;

  constructor(network: string) {
    this._config = {
      state: true,
    };

    this._getWidgetCommunication = this._getWidgetCommunication.bind(this);
    this._sendShowWidget = this._sendShowWidget.bind(this);
    this._sendHideWidget = this._sendHideWidget.bind(this);
    this._widgetManagerInstance = new WidgetManager(
      this.config,
      this._clearProviderSession
    );
    this._web3ManagerInstance = new Web3Manager(
      this.config,
      this._getWidgetCommunication,
      this._sendShowWidget,
      this._sendHideWidget,
      network
    );
    this.getWidget = this.getWidget.bind(this);
    this.hideWidget = this.hideWidget.bind(this);
    this.showWidget = this.showWidget.bind(this);
    // this.showKeyless = this.showKeyless.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.destroyOnLogout = this.destroyOnLogout.bind(this);
  }

  private async _getWidgetCommunication() {
    //this._widgetManagerInstance?.showIframe();
    return (await this._widgetManager.getWidget()).communication;
  }

  private _sendShowWidget() {
    //this._widgetManagerInstance?.showIframe();
    this._widgetManager.showWidget();
  }

  private _sendHideWidget() {
    //this._widgetManagerInstance?.showIframe();
    this._widgetManager.hideWidget();
  }

  get _widgetManager() {
    return this._widgetManagerInstance!;
  }

  get config() {
    return this._config!;
  }

  private _clearProviderSession() {
    //this._web3Manager.setSelectedAddress('');
  }

  // private

  get _web3Manager() {
    console.log("_web3Manager", this._web3ManagerInstance);
    return this._web3ManagerInstance!;
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

  async getWidget(): Promise<IWidget> {
    return this._widgetManager.getWidget();
  }

  async showWidget(): Promise<void> {
    this._widgetManager.showWidget();
  }

  async hideWidget(): Promise<void> {
    this._widgetManager.hideWidget();
  }

  // SDK Methods that could be invoked by the user and handled by the widget

  async init(state: boolean) {
    return this._widgetManager.init(state);
  }

  async updateWeb3(chainId: any) {
    this._web3ManagerInstance = new Web3Manager(
      this.config,
      this._getWidgetCommunication,
      this._sendShowWidget,
      this._sendHideWidget,
      chainId
    );

    return this;
  }

  async selectChain() {
    return await this._web3Manager.selectChain();
  }

  async getCurrentNetworkTokens() {
    return await this._web3Manager.getUserTokens();
  }

  async disconnect() {
    return await this._web3Manager.disconnetKeyless();
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
  onLogin(callback: (walletAddress: string, chainId: any) => void) {
    this._widgetManager.setOnLoginCallback(callback);
  }

  // Population by the dev of SDK callbacks that might be invoked by the widget.
  onLogout(callback: () => void) {
    this._widgetManager.setOnLogoutCallback(callback, this.destroyOnLogout);
  }
}
