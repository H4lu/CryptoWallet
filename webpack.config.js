const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");


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
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
          ],
        })
      },
      {
        test: /\.node$/,
        use: 'node-loader'
    },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'standard-loader',
        options: {
          typeCheck: true,
          emitErrors: true,
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /tar[\\\/].*\.js$/,
        loader: 'babel-loader!octal-number-loader'
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
        /^bindings$/,
        require.resolve("./bindings")
    ),
    new  webpack.NormalModuleReplacementPlugin(
      /^any-promise$/,
      require.resolve('bluebird')
    ),
    new ExtractTextPlugin("style.css")
], 
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json','.node']
  }
}

module.exports = Object.assign(
  {
    entry: { main: './src/Main.ts' }
  },
  commonConfig)

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [
    Object.assign(
      {
        target: 'electron-main',
        entry: { main: './src/main-process/Main.ts' }
      },
      commonConfig),
    Object.assign(
      {
        target: 'electron-renderer',
        entry: { gui: './src/ui/Index.tsx' },
        plugins: [new HtmlWebpackPlugin( {
          filename: 'index.html',
          template: './src/ui/index.html'
        })]
      },
      commonConfig)
  ]


