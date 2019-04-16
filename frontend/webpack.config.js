const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const HWP = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            }
        ]
    },
    watch: true,
    devServer: {
        contentBase: './dist',
        overlay: true,
        hot: true
    },
    plugins: [
        new HWP({template:path.join(__dirname, '/src/index.html')})
    ],
    resolve: {
            alias: {
                Actions: path.resolve(__dirname, 'src/actions'),
                Components: path.resolve(__dirname, 'src/components'),
                Hoc: path.resolve(__dirname, 'src/hoc'),
                Middlewares: path.resolve(__dirname, 'src/middlewares'),
                Reducers: path.resolve(__dirname, 'src/reducers'),
                Store: path.resolve(__dirname, 'src/store'),
                Pages: path.resolve(__dirname, 'src/pages'),
            }
    }
};