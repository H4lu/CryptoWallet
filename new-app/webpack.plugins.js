const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new webpack.NormalModuleReplacementPlugin(
    /^bindings$/,
    require.resolve("./bindings")
   ),
  
  // new CopyPlugin({
  //   patterns: [
  //     { from: "./src/API/resources/lib32.dll", to : "./main_window/resources/lib32.dll"}
  //   ]
  // })
];
