const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  node: {
    __dirname: true
  },
  devServer: {
    historyApiFallback: {
      index: 'index.html',
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  target: 'electron-renderer',
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
  externals: {
    // "ffi-napi": "ffi-napi",
    // "ref-napi": "ref-napi"
    // "ffi-napi": "commonjs ffi-napi",
    // "ref-napi": "commonjs ref-napi",
    // "ffi": "commonjs ffi",
    // "ref": "commonjs ref",
    // ffi: "ffi",
    // ref: "ref",
    // "ffi-napi": "require(ffi-napi)",
    // "ref-napi": "require(ref-napi)",
    // "ffi": "ffi",
    // "ref": "ref"
  }
};
