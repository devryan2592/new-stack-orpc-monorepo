import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*"],
  noExternal: [/^@workspace\/.*$/, /^@modules\/.*$/, /^@shared\/.*$/],
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  env: { IS_SERVER_BUILD: "true" },
  loader: { ".json": "copy", ".ejs": "copy" },
  minify: true,
  sourcemap: true,
  ...options,
}));
