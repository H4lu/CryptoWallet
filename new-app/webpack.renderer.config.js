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
  output: {
    publicPath: '/'
  },
  node: {
    __dirname: true
  },
  devServer: {
    historyApiFallback: {
      index: 'index.html',
    }
  },
  target: 'electron-renderer',
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
  externals: {
    "ffi-napi": "commonjs ffi-napi",
    "ref-napi": "commonjs ref-napi",
    "ffi": "commonjs ffi",
    "ref": "commonjs ref"
  }
};
