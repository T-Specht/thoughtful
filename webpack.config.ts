import { Configuration as WebpackConfiguration, Compiler } from 'webpack';
import { resolve } from 'path';
import { bundle as dts_bundle } from "dts-bundle";
import * as rimraf from "rimraf";

const IS_PROD = process.env.NODE_ENV == 'production';

console.log(IS_PROD);


export default {
    entry: resolve('src', 'index.ts'),
    output: {
        path: resolve('dist'),
        filename: 'thoughtful.min.js',
        library: 'thoughtful',
        libraryTarget: 'umd'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
    },
    module: {
        rules: [
            { test: /\.ts/, use: ['ts-loader'] }
        ]
    },
    plugins: [
        new DtsBundlePlugin()
    ]
} as WebpackConfiguration



// Bundling Definition files
// https://medium.com/@vladimirtolstikov/how-to-merge-d-ts-typings-with-dts-bundle-and-webpack-e8903d699576
function DtsBundlePlugin() { };
DtsBundlePlugin.prototype.apply = function (compiler: Compiler) {
    compiler.plugin('done', () => {
        dts_bundle({
            name: 'thoughtful',
            main: resolve('dist', 'src', 'index.d.ts'),
            out: resolve('dist', 'thoughtful.d.ts'),
            removeSource: IS_PROD,
            outputAsModuleFolder: true
        } as any)
        // Remove generated src/ files were types were stored before bundle
        if(IS_PROD) rimraf.sync(resolve('dist', 'src'));
    });
}