/// <reference path="/types/proxyIpcMessage.d.ts" />

declare const Logs: any;
declare const qwqnt: any;

interface Window {
  navigation: any;
  qwqnt: any;
}

declare global {
  var IpcInterceptor: IpcInterceptorType;
}
