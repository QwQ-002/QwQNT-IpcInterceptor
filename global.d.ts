/// <reference path="./proxyIpcMessage.d.ts" />

declare module "*.scss" {
  const content: string;
  export default content;
}

// ipc-logger 兼容
declare const Logs: any;

interface Window {
  navigation: any;
  qwqnt: any;
}

declare global {
  var IpcInterceptor: IpcInterceptorType;
}
