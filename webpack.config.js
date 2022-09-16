const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir){
    return path.join(__dirname, dir);
}

module.exports = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ["@babel/plugin-syntax-dynamic-import"]
                    }
                },
                exclude: /(node_modules)/
            },
            {
                test: /\.(ts|tsx)?$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        })
    ],
    resolve:{
        alias:{
            "@": resolve("src")
        },
        extensions: ['.tsx', '.ts', '.js']
    }
}