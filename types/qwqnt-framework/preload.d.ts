import { C as ContextGlobal } from './types-context-CFIIPswK.js';

type ContextPreload = ContextGlobal;
declare global {
    const qwqnt: Readonly<ContextPreload>;
    function evalModule(script: string): void;
}

export type { ContextPreload };
