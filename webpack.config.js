const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/apache-status.ts',
    //devtool: 'inline-source-map',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'apache-status.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    target: "node",
    plugins: [
        new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true})
    ]
};