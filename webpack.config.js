const path = require('path')
const webpack = require('webpack')
const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
    },
      {
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'standard-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
        /^bindings$/,
        require.resolve("./bindings")
    )
],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json','.node']
  }
}

module.exports = Object.assign(
  {
    entry: { main: './src/main.ts' }
  },
  commonConfig)

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [
    Object.assign(
      {
        target: 'electron-main',
        entry: { main: './src/main-process/main.ts' }
      },
      commonConfig),
    Object.assign(
      {
        target: 'electron-renderer',
        entry: { gui: './src/ui/Index.tsx' },
        plugins: [new HtmlWebpackPlugin( {
          template: './src/ui/index.html'
        })]
      },
      commonConfig)
  ]

