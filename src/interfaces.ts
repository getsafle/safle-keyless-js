import { AsyncMethodReturns } from 'penpal';

export interface IConnectionMethods {
  getAccounts: () => Promise<{ error: string; result: string[] }>;
  signData: (msgParams: any) => Promise<{ error: string; result: string }>;
  processTransaction: (msgParams: any) => Promise<{ error: string; result: string }>;
  signTransaction: (msgParams: any) => Promise<{ error: string; result: string }>;
  getBlockByNumber: () => Promise<{ error: string; result: string }>;
  init: (state?: boolean) => Promise<{ error: string; result: string }>;
}

export interface ISDKConfig {
  state?: boolean;
}

export interface IWidget {
  communication: AsyncMethodReturns<IConnectionMethods>;
  widgetFrame: HTMLDivElement;
}

export interface IMessageParams {
  from: string;
  data: string | ITypedDataMessage[];
  messageStandard: 'signMessage' | 'signPersonalMessage' | 'signTypedMessage';
}

export interface ITypedDataMessage {
  name: string;
  type: string;
  value: string;
}

export interface INetwork {
  nodeUrl: string;
  chainId?: string;
}
