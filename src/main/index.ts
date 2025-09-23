import { BrowserWindow } from "electron";
import { proxyIpcMessages, IpcInterceptor } from "./modules/proxyIpcMessage";

function onBrowserWindowCreated(window: BrowserWindow) {
  proxyIpcMessages(window);
}

(globalThis as any).IpcInterceptor = IpcInterceptor;

if ("qwqnt" in globalThis) {
  qwqnt.main.hooks.whenBrowserWindowCreated.peek(onBrowserWindowCreated);
}

module.exports = { onBrowserWindowCreated };
