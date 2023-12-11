declare const ProviderEngine: any;
import { IConnectionMethods, ISDKConfig } from "./interfaces";
import { AsyncMethodReturns } from "penpal";
export default class Web3Manager {
    private config;
    private _getWidgetCommunication;
    private _sendShowWidget;
    private _sendHideWidget;
    private rpc;
    private engine;
    provider: typeof ProviderEngine;
    rpcUrl?: string;
    private _selectedAddress?;
    private _signature?;
    private _widgetManagerInstance?;
    constructor(config: ISDKConfig, _getWidgetCommunication: () => Promise<AsyncMethodReturns<IConnectionMethods>>, _sendShowWidget: () => void, _sendHideWidget: () => void, rpc: string);
    setSelectedAddress(selectedAddress: string): void;
    selectChain(): Promise<void>;
    disconnetKeyless(): Promise<void>;
    getUserTokens(): Promise<any>;
    private setNetwork;
    private _initProvider;
    private clearSubprovider;
}
export {};
