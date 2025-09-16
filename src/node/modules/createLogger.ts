class LocalLogger {
  constructor(private moduleName: string) {}
  log = (...args: any[]) => {
    console.log(`[${this.moduleName}]`, ...args);
  };
}

function createLogger(moduleName: string) {
  const logsInstance = "Logs" in globalThis ? new Logs(moduleName) : new LocalLogger(moduleName).log;
  return (...args: any[]) => {
    logsInstance(...args);
  };
}

export { createLogger };
