# QwQNT-ipc_interceptor

统一管理 IPC 事件

### 功能

- 统一管理 IPC 注入事件，避免每个插件重复代理导致的性能问题

### 使用方法

在 `package.json` 中添加`ipc_interceptor` 依赖

```json
"qwqnt":{
  "dependencies": {
    "ipc_interceptor": "^0.0.1"
  }
}
```

在 `main` 进程中使用全局 `IpcInterceptor` 对象即可

使用演示：

```js
IpcInterceptor.onIpcSend((...args) => {
  // ...your code
});
```

对于使用 Typescript 编写插件的开发者，可能需要将 `proxyIpcMessage` 写入 `global.d.ts` 中

```js
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
```

### 构建方法

- `pnpm i`
- `pnpm run build`
