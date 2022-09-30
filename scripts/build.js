let makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

require("esbuild")
  .build({
    bundle: true,
    platform: "node",
    target: "node12",
    outdir: "dist",
    sourcemap: true,
    format: "cjs",
    entryPoints: ["src/tracing.ts"],
    plugins: [makeAllPackagesExternalPlugin],
  })
  .catch(() => process.exit(1));
