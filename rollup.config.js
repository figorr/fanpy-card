import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/fan-custom-card.js",
    output: {
      file: "dist/fan-custom-card.js",
      format: "es",
      sourcemap: false,
    },
    external: [],
    plugins: [resolve({ browser: true }), commonjs(), json(), terser()],
  },
  {
    input: "src/fan-custom-card-editor.js",
    output: {
      file: "dist/fan-custom-card-editor.js",
      format: "es",
      sourcemap: false,
    },
    external: [],
    plugins: [resolve({ browser: true }), commonjs(), json(), terser()],
  },
];
