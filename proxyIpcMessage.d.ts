// ipc-interceptor.d.ts
import { BrowserWindow } from "electron";

type Unsubscribe = () => void;
type EventName = string | string[];
type IpcCallback = (...args: any[]) => void;

interface IpcInterceptorType {
  onIpcReceive(callback: IpcCallback): Unsubscribe;
  onIpcSend(callback: IpcCallback): Unsubscribe;
  offIpcReceive(callback: IpcCallback): void;
  offIpcSend(callback: IpcCallback): void;
  onIpcReceiveEvents(eventName: EventName, callback: IpcCallback): Unsubscribe;
  onIpcSendEvents(eventName: EventName, callback: IpcCallback): Unsubscribe;
  offIpcReceiveEvents(eventName: EventName, callback: IpcCallback): void;
  offIpcSendEvents(eventName: EventName, callback: IpcCallback): void;
}

declare function proxyIpcMessages(window: BrowserWindow): void;

declare const IpcInterceptor: IpcInterceptorType;

export { proxyIpcMessages, IpcInterceptor };

declare global {
  namespace NodeJS {
    interface Global {
      IpcInterceptor: IpcInterceptorType;
    }
  }
}
