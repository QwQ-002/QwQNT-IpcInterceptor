import { build, context, BuildOptions } from "esbuild";
import fs from "node:fs";

const isDev = process.argv.includes("--watch");
const isPublish = process.argv.includes("--publish");

// 通用配置
const baseConfig: BuildOptions = {
  bundle: true,
  charset: "utf8",
  tsconfig: "./tsconfig.json",
};

// node 构建配置
const nodeConfig: BuildOptions = {
  ...baseConfig,
  platform: "node",
  target: "node20",
  format: "cjs",
  entryPoints: ["src/main/index.ts"],
  outfile: "dist/main/index.js",
  external: ["electron"],
};

// 构建函数
async function runBuild() {
  if (isDev) {
    console.log("Starting development build...");

    const mainCtx = await context(nodeConfig);

    await mainCtx.watch();

    console.log("Development build started. Watching for changes...");
  } else {
    console.log("Starting production build...");
    try {
      await Promise.all([build(nodeConfig)]);

      if (isPublish) {
        // 同步版本号
        const manifestJSON = JSON.parse(fs.readFileSync("./manifest.json", "utf-8"));
        const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
        manifestJSON.version = packageJSON.version;
        manifestJSON.repository.release.tag = `v${packageJSON.version}`;
        fs.writeFileSync("./manifest.json", JSON.stringify(manifestJSON, null, 2));
      }

      console.log("Production build completed successfully.");
    } catch (err) {
      console.error("Error during production build:", err);
      process.exit(1);
    }
  }
}
runBuild().catch((err) => {
  console.error("Unhandled error in build script:", err);
  process.exit(1);
});
