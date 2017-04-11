import { Configuration as WebpackConfiguration, Compiler } from 'webpack';
import { resolve } from 'path';
export default {
    entry: resolve('src', 'index.ts'),
    output: {
        path: resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
    },
    module: {
        rules: [
            { test: /\.ts/, use: ['ts-loader'] }
        ]
    }
} as WebpackConfiguration

