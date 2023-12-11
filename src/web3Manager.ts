const ProviderEngine = require("web3-provider-engine");
const CacheSubprovider = require("web3-provider-engine/dist/es5/subproviders/cache.js");
const FixtureSubprovider = require("web3-provider-engine/dist/es5/subproviders/fixture.js");
const FilterSubprovider = require("web3-provider-engine/dist/es5/subproviders/filters.js");
const HookedWalletSubprovider = require("web3-provider-engine/dist/es5/subproviders/hooked-wallet.js");
const NonceSubprovider = require("web3-provider-engine/dist/es5/subproviders/nonce-tracker.js");
const SubscriptionsSubprovider = require("web3-provider-engine/dist/es5/subproviders/subscriptions.js");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");
import { IConnectionMethods, ISDKConfig } from "./interfaces";
import { AsyncMethodReturns } from "penpal";
import { Query } from "./utils/query";
import WidgetManager from "./widgetManager";
import { getTxGas } from "./utils/getTxGas";
import { networkAdapter } from "./networks";

type ProviderCallback = (error: string | null, result: any) => void;
export default class Web3Manager {
  private engine: typeof ProviderEngine;
  provider: typeof ProviderEngine;
  rpcUrl?: string;
  private _selectedAddress?: string;
  private _signature?: string;
  private _widgetManagerInstance?: WidgetManager;
  constructor(
    private config: ISDKConfig,
    private _getWidgetCommunication: () => Promise<
      AsyncMethodReturns<IConnectionMethods>
    >,
    private _sendShowWidget: () => void,
    private _sendHideWidget: () => void,
    private rpc: string
  ) {
    console.log("rpc", rpc);
    this.rpcUrl = this.setNetwork(rpc);
    this.provider = this._initProvider();
  }

  setSelectedAddress(selectedAddress: string) {
    this._selectedAddress = selectedAddress;
  }

  async selectChain(): Promise<void> {
    this._sendShowWidget();
    const widgetCommunication = await this._getWidgetCommunication();
    console.log("selectChain", widgetCommunication);
    await widgetCommunication.selectChain();
  }

  async disconnetKeyless(): Promise<void> {
    const widgetCommunication = await this._getWidgetCommunication();
    console.log("disconnetKeyless", widgetCommunication);
    await widgetCommunication.disconnetKeyless();
  }

  async getUserTokens(): Promise<any> {
    try {
      const widgetCommunication = await this._getWidgetCommunication();
      console.log("getUserTokens", widgetCommunication);
      const res = await widgetCommunication.getUserTokens();
      if (res.success) {
        return res.resp;
      } else {
        return "Unable to fetch user tokens";
      }
    } catch (e: any) {
      console.log(e);
      return e.message;
    }
  }

  private setNetwork(network: string) {
    const newNetwork = networkAdapter(network);
    console.log("newNetwork", newNetwork);
    return newNetwork;
  }

  private _initProvider() {
    // don't init the engine twice
    if (this.engine) {
      return this.engine;
    }

    this.engine = new ProviderEngine();
    const query = new Query(this.engine);

    this.engine.send = (payload: any, callback: any) => {
      // Web3 1.0 beta.38 (and above) calls `send` with method and parameters
      if (typeof payload === "string") {
        return new Promise((resolve, reject) => {
          this.engine.sendAsync(
            {
              jsonrpc: "2.0",
              id: 42,
              method: payload,
              params: callback || [],
            },
            (error: any, response: any) => {
              if (error) {
                reject(error);
              } else {
                resolve(response.result);
              }
            }
          );
        });
      }

      // Web3 1.0 beta.37 (and below) uses `send` with a callback for async queries
      if (callback) {
        this.engine.sendAsync(payload, callback);
        return;
      }

      let result: any = null;
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
      setEngine: (_: any) => _,
      handleRequest: async (payload: any, next: () => {}) => {
        if (!payload.id) {
          payload.id = 42;
        }
        next();
      },
    });
    this.engine.addProvider(
      new HookedWalletSubprovider({
        getAccounts: async (cb: ProviderCallback) => {
          const widgetCommunication = await this._getWidgetCommunication();
          console.log("getAccounts:HookedWallet", widgetCommunication);
          widgetCommunication.getAccounts().then((result: any) => {
            console.log(result);
            let error: any = null;
            if (result.success) {
              this._selectedAddress = result.resp?.addresses[0];
              this._widgetManagerInstance?.hideIframe();
              cb(error, result.resp?.addresses);
            } else {
              error = result.error;
              cb(error, result.error?.message);
            }
          });
        },
        signMessage: async (msgParams: any, cb: ProviderCallback) => {
          this._sendShowWidget();
          const widgetCommunication = await this._getWidgetCommunication();
          console.log("signMessageHooked", widgetCommunication);
          const params = { ...msgParams, messageStandard: "signMessage" };
          widgetCommunication.signData(params).then((result: any) => {
            console.log(result);
            let error: any = null;
            if (result.success) {
              this._signature = result.resp?.sign_resp;
            // this._sendHideWidget();
            cb(error, result.resp?.sign_resp);
            } else {
              error = result.error;
              cb(error, result.error?.message);
            }
          });
        },
        processTransaction: async (msgParams: any, cb: ProviderCallback) => {
          this._sendShowWidget();
          const widgetCommunication = await this._getWidgetCommunication();
          console.log("signMessageHooked", widgetCommunication);
          const params = {
            ...msgParams,
            messageStandard: "processTransaction",
          };
          widgetCommunication
            .processTransaction(msgParams)
            .then((result: any) => {
              console.log(result);
              let error: any = null;
              if (result.success) {
                //this._signature = result.resp.sign_resp;
              // this._sendHideWidget();
              cb(error, result.resp);
              } else {
                error = result.error;
                cb(error, result.resp);
              }
            });
        },
        signTransaction: async (txParams: any, cb: ProviderCallback) => {
          this._sendShowWidget();
          const widgetCommunication = await this._getWidgetCommunication();
          const { error, result } = await widgetCommunication.signTransaction(
            txParams
          );
          cb(error, result);
          // setTimeout(() => {
          //   this._sendHideWidget();
          // }, 5000);
        },
        estimateGas: async (txParams: any, cb: ProviderCallback) => {
          const gas = await getTxGas(query, txParams);
          cb(null, gas);
        },
        getGasPrice: async (cb: ProviderCallback) => {
          cb(null, "");
        },
      })
    );

    // data source
    if (this.rpcUrl) {
      console.log("RPCURL", this.rpcUrl);
      this.engine.addProvider(
        new RpcSubprovider({
          // rpcUrl: 'https://polygon-mumbai.infura.io/v3/814228beb1ff4d5991988329e57c349c',
          rpcUrl: this.rpcUrl,
        })
      );
    } else {
      // Handle RPCURL not found.
      console.log("RPC->else", this.rpcUrl);
    }

    this.engine.enable = () =>
      new Promise((resolve, reject) => {
        this.engine.sendAsync(
          { method: "eth_accounts" },
          (error: any, response: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(response.result);
            }
          }
        );
      });

    this.engine.isConnected = () => {
      return true;
    };

    this.engine.isKeyless = true;

    this.engine.on("error", (error: any) => {
      if (
        error &&
        error.message &&
        error.message.includes("PollingBlockTracker")
      ) {
        //console.warn('If you see this warning constantly, there might be an error with your RPC Node.')
      } else {
        console.error(error);
      }
    });

    this.engine.start();
    console.log(this.engine);
    return this.engine;
  }

  private clearSubprovider(subproviderType: any) {
    const subprovider = this.provider._providers.find(
      (subprovider: any) => subprovider instanceof subproviderType
    );
    this.provider.removeProvider(subprovider);
    this.provider.addProvider(new subproviderType());
  }
}
