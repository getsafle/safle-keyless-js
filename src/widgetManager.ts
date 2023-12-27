import * as Penpal from "penpal";
import { IConnectionMethods, ISDKConfig, IWidget } from "./interfaces";
import { styles } from "./styles";
import { onWindowLoad } from "./utils/onWindowLoad";

const WIDGET_URL = "http://localhost:3000/";
const KEYLESS_CONTAINER_CLASS = "safle_keyless-container";
const KEYLESS_IFRAME_CLASS = "safle_keyless-widget-frame";

export default class WidgetManager {
  private widgetPromise?: Promise<IWidget>;
  private widgetInstance?: IWidget;
  private _widgetUrl = WIDGET_URL;
  private _onLoginCallback: (walletAddress: string, chainId: any) => void =
    () => {};
  private _onLogoutCallback: () => void = () => {};
  private _destroyOnLogout: () => void = () => {};
  iframe: HTMLIFrameElement | null = null;

  constructor(
    private _widgetConfig: ISDKConfig,
    private _clearProviderSession: () => void
  ) {
    WidgetManager._checkIfWidgetAlreadyInitialized();
  }
  private static _checkIfWidgetAlreadyInitialized() {
    if (document.getElementsByClassName(KEYLESS_CONTAINER_CLASS).length) {
      console.warn(
        "An instance of Portis was already initialized. This is probably a mistake. Make sure that you use the same Portis instance throughout your app."
      );
    }
  }
  async getWidget() {
    if (!this.widgetInstance) {
      if (!this.widgetPromise) {
        this.widgetPromise = this._initWidget();
      }
      this.widgetInstance = await this.widgetPromise;
      //if (this.iframe) this.iframe.style.display = "none";

      console.log(this.widgetInstance);
    }
    return this.widgetInstance;
  }

  async showWidget() {
    if (this.iframe) this.iframe.style.display = "block";
  }

  async hideWidget() {
    if (this.iframe) this.iframe.style.display = "none";
  }

  private async _initWidget(): Promise<IWidget> {
    await onWindowLoad();

    const style = document.createElement("style");
    style.innerHTML = styles;

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
    this.iframe.style.position = "absolute";

    document.body.appendChild(this.iframe);

    try {
      const connection = Penpal.connectToChild<IConnectionMethods>({
        debug: true,
        iframe: this.iframe,
        methods: {
          parentMethod: (res: any) => {
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
              } else {
                document.body.removeChild(this.iframe);
              }
            }
            if (res.loginSuccess && res.isFirstLogin) {
              console.log(
                "IN WIDGET MANAGER ",
                res.data[0],
                `${Number(res.currentChain.chainId)}`
              );
              this._onLogin(res.data[0], `${Number(res.currentChain.chainId)}`);
            }
            if (res.isLogout) {
              this._onLogout();
            }
            return res;
          },
        },
      });
      const communication = await connection.promise;
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // parseResult(data){
  //   if(data.type=='hget'){

  //   }
  // }
  // Population by the dev of SDK callbacks that might be invoked by the widget
  setOnLoginCallback(callback: (walletAddress: string, chainId: any) => void) {
    this._onLoginCallback = callback;
  }

  setOnLogoutCallback(callback: () => void, destroyCallback: () => void) {
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

  async init(state: boolean) {
    const widgetCommunication = (await this.getWidget()).communication;
    widgetCommunication.init(state).then((res: any) => {
      console.log("initinit", res);
    });
  }
  async showIframe() {
    if (this.iframe) this.iframe.style.display = "none";
    if (this.iframe) this.iframe.style.display = "block";
  }
  async hideIframe() {
    if (this.iframe) this.iframe.style.display = "none";
  }

  private _onLogin(walletAddress: string, chainId: any) {
    if (this._onLoginCallback) {
      this._onLoginCallback(walletAddress, chainId);
    }
  }
  private _onLogout() {
    if (this._onLogoutCallback) {
      this._onLogoutCallback();
    }
    if (this._destroyOnLogout) this._destroyOnLogout();
  }
}
