/// <reference types="./types/qwqnt-framework/main.d.ts" />

declare module "*.scss" {
  const content: string;
  export default content;
}

interface Window {
  navigation: any;
  qwqnt: any;
}

declare namespace RendererEvents {
  const onSettingsWindowCreated: (callback: () => void) => void;
}

interface IQwQNTPlugin {
  name: string;
  qwqnt: {
    name: string;
    inject: {
      renderer?: string;
      preload?: string;
    };
  };
}

declare namespace PluginSettings {
  interface ICommon {
    readConfig: <T>(id: string, defaultConfig?: T) => Promise<T>;
    writeConfig: <T>(id: string, newConfig: T) => void;
  }
  interface IRenderer extends ICommon {
    registerPluginSettings: (packageJson: IQwQNTPlugin) => HTMLDivElement;
  }

  const main: ICommon;
  const renderer: IRenderer;
}

declare namespace NodeJS {
  interface Global {
    IpcInterceptor: {
      onIpcReceive: typeof import("./src/node/modules/proxyIpcMessage").onIpcReceive;
      onIpcSend: typeof import("./src/node/modules/proxyIpcMessage").onIpcSend;
      offIpcReceive: typeof import("./src/node/modules/proxyIpcMessage").offIpcReceive;
      offIpcSend: typeof import("./src/node/modules/proxyIpcMessage").offIpcSend;
    };
  }
}