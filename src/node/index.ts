import { BrowserWindow } from "electron";
import { proxyIpcMessages, IpcInterceptor } from "./modules/proxyIpcMessage";
function onBrowserWindowCreated(window: BrowserWindow) {
  proxyIpcMessages(window);
}

(global as any).IpcInterceptor = IpcInterceptor;

if ("qwqnt" in global) {
  qwqnt.main.hooks.whenBrowserWindowCreated.peek(onBrowserWindowCreated);
}

module.exports = { onBrowserWindowCreated };
