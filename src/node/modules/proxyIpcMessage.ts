import { BrowserWindow } from "electron";
import { Logs } from "./logs";

const logs = new Logs("IPC Proxy");
const log = logs.log;

// 接收端 & 发送端回调集合（全局）
const ipcReceiveHandlers: Set<Function> = new Set();
const ipcSendHandlers: Set<Function> = new Set();

// 按事件名区分的监听器
const ipcReceiveEventHandlers: Map<string, Set<Function>> = new Map();
const ipcSendEventHandlers: Map<string, Set<Function>> = new Map();

type Unsubscribe = () => void;
type EventName = string | Array<string>;

// 工具函数：确保事件名是数组
function normalizeEventNames(eventName: EventName): string[] {
  return Array.isArray(eventName) ? eventName : [eventName];
}

// 添加监听
function onIpcReceive(callback: Function): Unsubscribe {
  if (typeof callback === "function") {
    ipcReceiveHandlers.add(callback);
    return () => offIpcReceive(callback);
  }
  return () => {};
}

function onIpcSend(callback: Function): Unsubscribe {
  if (typeof callback === "function") {
    ipcSendHandlers.add(callback);
    return () => offIpcSend(callback);
  }
  return () => {};
}

function onIpcReceiveEvents(eventName: EventName, callback: Function): Unsubscribe {
  if (typeof callback !== "function") return () => {};
  const names = normalizeEventNames(eventName);
  names.forEach((name) => {
    if (!ipcReceiveEventHandlers.has(name)) {
      ipcReceiveEventHandlers.set(name, new Set());
    }
    ipcReceiveEventHandlers.get(name)!.add(callback);
  });
  return () => offIpcReceiveEvents(eventName, callback);
}

function onIpcSendEvents(eventName: EventName, callback: Function): Unsubscribe {
  if (typeof callback !== "function") return () => {};
  const names = normalizeEventNames(eventName);
  names.forEach((name) => {
    if (!ipcSendEventHandlers.has(name)) {
      ipcSendEventHandlers.set(name, new Set());
    }
    ipcSendEventHandlers.get(name)!.add(callback);
  });
  return () => offIpcSendEvents(eventName, callback);
}

// 取消监听
function offIpcReceive(callback: Function) {
  ipcReceiveHandlers.delete(callback);
}

function offIpcSend(callback: Function) {
  ipcSendHandlers.delete(callback);
}

function offIpcReceiveEvents(eventName: EventName, callback: Function) {
  const names = normalizeEventNames(eventName);
  names.forEach((name) => {
    const set = ipcReceiveEventHandlers.get(name);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        ipcReceiveEventHandlers.delete(name);
      }
    }
  });
}

function offIpcSendEvents(eventName: EventName, callback: Function) {
  const names = normalizeEventNames(eventName);
  names.forEach((name) => {
    const set = ipcSendEventHandlers.get(name);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        ipcSendEventHandlers.delete(name);
      }
    }
  });
}

// 代理逻辑
function proxyIpcMessages(window: BrowserWindow) {
  if (!(window instanceof BrowserWindow)) {
    throw new TypeError("Expected a BrowserWindow instance");
  }

  if ((window as any)._ipcProxied) return;
  (window as any)._ipcProxied = true;

  const webContents = window.webContents as unknown as { _events: Record<string, any> };
  const events = webContents._events;
  if (!events) {
    log("No events found on webContents.");
    return;
  }

  // 代理接收端
  if (events["-ipc-message"]) {
    const originalReceive = events["-ipc-message"];
    events["-ipc-message"] = new Proxy(originalReceive, {
      apply(target, thisArg, args) {
        // 全局监听器
        for (const handler of ipcReceiveHandlers) {
          try {
            handler(...args);
          } catch (err: any) {
            log("Receive handler error:", err, err?.stack);
          }
        }
        // 按事件名监听器
        const evtSet = ipcReceiveEventHandlers.get(args?.[3]?.[1]?.cmdName);
        if (evtSet) {
          for (const handler of evtSet) {
            try {
              handler(...args);
            } catch (err: any) {
              log("Receive event handler error:", err, err?.stack);
            }
          }
        }
        return target.apply(thisArg, args);
      },
    });
  } else {
    log("No '-ipc-message' listener found.");
  }

  // 代理发送端
  const originalSend = window.webContents.send;
  window.webContents.send = new Proxy(originalSend, {
    apply(target, thisArg, args) {
      // 全局监听器
      for (const handler of ipcSendHandlers) {
        try {
          handler(...args);
        } catch (err: any) {
          log("Send handler error:", err, err?.stack);
        }
      }
      // 按事件名监听器
      const evtSet = ipcSendEventHandlers.get(args?.[2]?.cmdName);
      if (evtSet) {
        for (const handler of evtSet) {
          try {
            handler(...args);
          } catch (err: any) {
            log("Send event handler error:", err, err?.stack);
          }
        }
      }
      return target.apply(thisArg, args as [string, ...any[]]);
    },
  });
}

const IpcInterceptor = {
  onIpcReceive,
  onIpcSend,
  offIpcReceive,
  offIpcSend,
  onIpcReceiveEvents,
  onIpcSendEvents,
  offIpcReceiveEvents,
  offIpcSendEvents,
};

export { proxyIpcMessages, IpcInterceptor };
