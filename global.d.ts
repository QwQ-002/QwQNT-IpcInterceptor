/// <reference path="./types/qwqnt-framework/main.d.ts" />
/// <reference path="./proxyIpcMessage.d.ts" />

declare module "*.scss" {
  const content: string;
  export default content;
}

interface Window {
  navigation: any;
  qwqnt: any;
}