export const Logs = class Logger {
  logName: string;
  constructor(logName: string) {
    this.logName = logName;
  }
  log(...args: any[]) {
    if ("cacheLogs" in global) {
      globalThis.cacheLogs.push([this.logName, ...args]);
    }
    console.log(`[${this.logName}]`, ...args);
  }
};
