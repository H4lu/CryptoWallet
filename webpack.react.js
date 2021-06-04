const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    // need for ffi-napi and ref-napi
    node: {
        __dirname: true
    },
    entry: path.resolve(__dirname, './src/ui/Index.tsx'),
    target: 'electron-renderer',
    output: {
        path: __dirname + '/dist',
        filename: 'gui.js'
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            ['@']: path.resolve(__dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js', '.node'],
    },
    module: {
        rules: [{
            test: /\.ts(x?)$/,
            include: /src/,
            use: [{ 
                loader: 'ts-loader', 
                options: {
                    onlyCompileBundledFiles: true,
                } 
            }]
        }, {
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        },{
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use : [
              //  {loader: 'cache-loader'},
                {loader: 'file-loader',
                 options: {
                     name : 'assets/[name].[contenthash].[ext]',
                } 
                }
            ]
          },{
            test: /\.css$/,
            exclude: /node_modules/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: ''
                }
            },{
                loader: "css-loader"
            }]
        }, {
            test: /\.node$/,
            include: /node_modules/,
            loader: 'node-loader'
        },
    ]
    },
        
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/ui/index.html',
            inject: 'body'
        }),
        new webpack.NormalModuleReplacementPlugin(
            /^bindings$/,
            require.resolve("./bindings")
        )
    ]
};
