import { INetwork, ISDKConfig, IWidget } from "./interfaces";
import Web3Manager from "./web3Manager";
import WidgetManager from "./widgetManager";

export default class Keyless {
  private _widgetManagerInstance?: WidgetManager;
  private _web3ManagerInstance?: Web3Manager;
  private _config?: ISDKConfig;


  constructor(network: string) {
    this._config = {
      state: true,
    };

    this._getWidgetCommunication = this._getWidgetCommunication.bind(this);
    this._widgetManagerInstance = new WidgetManager(
      this.config,
      this._clearProviderSession
    );
    this._web3ManagerInstance = new Web3Manager(
      this.config,
      this._getWidgetCommunication,
      network
    );
    this.getWidget = this.getWidget.bind(this);
    // this.showKeyless = this.showKeyless.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  private async _getWidgetCommunication() {
    //this._widgetManagerInstance?.showIframe();
    return (await this._widgetManager.getWidget()).communication;
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

  get _web3Manager() {
    console.log("_web3Manager", this._web3ManagerInstance)
    return this._web3ManagerInstance!;
  }

  get web3Provider() {
    console.log("web3Provider")
    console.log("web3Provider", this._web3Manager.provider)
    return this._web3Manager.provider;
  }

  get provider() {
    console.log("provider")
    return this.web3Provider;
  }

  // changeNetwork(network: string){
  //   this._web3Manager.changeNetwork(network);
  // }

  async getWidget(): Promise<IWidget> {
    return this._widgetManager.getWidget();
  }

  // SDK Methods that could be invoked by the user and handled by the widget

  async init(state: boolean) {
    return this._widgetManager.init(state);
  }

  // Population by the dev of SDK callbacks that might be invoked by the widget.
  onLogin(callback: (walletAddress: string) => void) {
    this._widgetManager.setOnLoginCallback(callback);
  }
}






