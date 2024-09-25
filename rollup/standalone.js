// Rollup plugins
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";

import filesize from "rollup-plugin-filesize";

export default {
    input: "src/standalone/index.js",
    output: {
        file: "dist/notStore.js",
        format: "iife",
        name: "notStore",
        sourcemap: false,
    },
    plugins: [
        svelte({
            emitCss: true,
        }),
        resolve({
            browser: true,
            dedupe: (importee) =>
                importee === "svelte" || importee.startsWith("svelte/"),
            preferBuiltins: true,
        }),
        commonjs(),
        postcss({
            extract: true,
            minimize: true,
            use: [
                [
                    "sass",
                    {
                        includePaths: ["./node_modules"],
                    },
                ],
            ],
        }),
        //(process.env.ENV !== 'test' && process.env.ENV !== 'debug' &&
        babel({
            babelHelpers: "bundled",
            babelrc: false,
            exclude: [
                "tmpl/**",
                "build/**",
                "node_modules/**",
                "css/**",
                "js/**",
                "test/**",
                "bower_components/**",
                "assets/*",
                "dist/**",
            ],
            plugins: [
                "@babel/plugin-syntax-class-properties",
                "@babel/plugin-proposal-class-properties",
                "@babel/transform-arrow-functions",
            ],
            presets: [
                [
                    "@babel/preset-env",
                    {
                        corejs: 3,
                        modules: false,
                        targets: "> 2.5%, not dead",
                        useBuiltIns: "usage",
                    },
                ],
            ],
        }),
        //)
        /*(process.env.ENV === 'test' && istanbul({
      extensions: ['.js', '.svelte'],
      compact: false,
      debug: true,
      exclude: ['rollup', 'cypress', 'node_modules/**', 'node_modules/@babel/runtime/helpers/**', 'node_modules/@babel/runtime/regenerator/**', 'node_modules/regenerator-runtime/**']
    })),*/
        filesize(),
    ],
};
