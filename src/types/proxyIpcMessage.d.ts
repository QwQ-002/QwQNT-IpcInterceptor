type Unsubscribe = () => void;
type EventName = string | string[];
type IpcCallback = (...args: any[]) => void;
type IpcInterceptCallback = (...args: any[]) => any;

interface IpcInterceptorType {
  onIpcReceive(callback: IpcCallback): Unsubscribe;
  onIpcSend(callback: IpcCallback): Unsubscribe;
  onIpcReceiveEvents(eventName: EventName, callback: IpcCallback): Unsubscribe;
  onIpcSendEvents(eventName: EventName, callback: IpcCallback): Unsubscribe;
  offIpcReceive(callback: IpcCallback): void;
  offIpcSend(callback: IpcCallback): void;
  offIpcReceiveEvents(eventName: EventName, callback: IpcCallback): void;
  offIpcSendEvents(eventName: EventName, callback: IpcCallback): void;

  interceptIpcReceive(callback: IpcInterceptCallback): Unsubscribe;
  interceptIpcSend(callback: IpcInterceptCallback): Unsubscribe;
  interceptIpcReceiveEvents(eventName: EventName, callback: IpcInterceptCallback): Unsubscribe;
  interceptIpcSendEvents(eventName: EventName, callback: IpcInterceptCallback): Unsubscribe;
  offInterceptIpcReceive(callback: IpcInterceptCallback): void;
  offInterceptIpcSend(callback: IpcInterceptCallback): void;
  offInterceptIpcReceiveEvents(eventName: EventName, callback: IpcInterceptCallback): void;
  offInterceptIpcSendEvents(eventName: EventName, callback: IpcInterceptCallback): void;
}

declare const IpcInterceptor: IpcInterceptorType;
