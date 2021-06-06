const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  // new CopyPlugin({
  //   patterns: [
  //     { from: "./src/API/resources/lib32.dll", to : "./main_window/resources/lib32.dll"}
  //   ]
  // })
];
