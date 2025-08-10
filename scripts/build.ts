import { build, context, BuildOptions } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const isDev = process.argv.includes("--watch");

// 通用配置
const baseConfig: BuildOptions = {
  bundle: true,
  // minify: !isDev,
  minify: false,
  sourcemap: isDev ? "linked" : false,
  charset: "utf8",
};

// node 构建配置
const nodeConfig: BuildOptions = {
  ...baseConfig,
  platform: "node",
  target: "node20",
  format: "cjs",
  entryPoints: ["src/node/index.ts"],
  outfile: "dist/node/index.js",
  external: ["electron"],
  tsconfig: "./src/node/tsconfig.json",
};

// 构建函数
async function runBuild() {
  if (isDev) {
    console.log("Starting development build...");
    const nodeContext = await context(nodeConfig);
    await nodeContext.watch();
    console.log("Development build started. Watching for changes...");
  } else {
    console.log("Starting production build...");
    try {
      await Promise.all([build(nodeConfig)]);
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
