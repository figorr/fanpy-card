import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/fanpy-card.js",
    output: {
      file: "dist/fanpy-card.js",
      format: "es",
      sourcemap: false,
    },
    external: [],
    plugins: [resolve({ browser: true }), commonjs(), json(), terser()],
  },
  {
    input: "src/fanpy-card-editor.js",
    output: {
      file: "dist/fanpy-card-editor.js",
      format: "es",
      sourcemap: false,
    },
    external: [],
    plugins: [resolve({ browser: true }), commonjs(), json(), terser()],
  },
];
