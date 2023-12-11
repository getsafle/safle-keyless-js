import { ISDKConfig, IWidget } from "./interfaces";
export default class WidgetManager {
    private _widgetConfig;
    private _clearProviderSession;
    private widgetPromise?;
    private widgetInstance?;
    private _widgetUrl;
    private _onLoginCallback;
    private _onLogoutCallback;
    private _destroyOnLogout;
    iframe: HTMLIFrameElement | null;
    constructor(_widgetConfig: ISDKConfig, _clearProviderSession: () => void);
    private static _checkIfWidgetAlreadyInitialized;
    getWidget(): Promise<IWidget>;
    showWidget(): Promise<void>;
    hideWidget(): Promise<void>;
    private _initWidget;
    setOnLoginCallback(callback: (walletAddress: string, chainId: any) => void): void;
    setOnLogoutCallback(callback: () => void, destroyCallback: () => void): void;
    init(state: boolean): Promise<void>;
    showIframe(): Promise<void>;
    hideIframe(): Promise<void>;
    private _onLogin;
    private _onLogout;
}
