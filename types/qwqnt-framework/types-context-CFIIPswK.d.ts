interface Plugin {
    path: string;
    packageJson: object;
}

type TomlValue = string | number | boolean | TomlValue[] | {
    [key: string]: TomlValue;
};
interface CoreExports {
    version: string;
    pathDll: string;
    configs: Record<string, TomlValue> & {
        qwqnt: {
            save: string;
            load: string;
        };
    };
}
interface FrameworkExports {
    version: string;
    paths: {
        configs: string;
        data: string;
        logs: string;
        plugins: string;
        stylesheets: string;
    };
    plugins: Plugin[];
}
interface ContextGlobal {
    core: CoreExports;
    framework: FrameworkExports;
}

export type { ContextGlobal as C };
