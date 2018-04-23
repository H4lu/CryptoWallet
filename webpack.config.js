const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  externals: {
    "keccak": "require('keccak')"
  },
  node: {
    __dirname: false
  },
  resolve: {
  alias: {
    validation: path.resolve(__dirname, 'node_modules/validation/build/Release/validation.node'),
    bufferutil: path.resolve(__dirname, 'node_modules/bufferutil/build/Release/bufferutil.node'),
    scrypt: path.resolve(__dirname, 'node_modules/scrypt/build/Release/scrypt.node'),
    // pcsclite: path.resolve(__dirname, 'node_modules/pcsclite/build/Release/pcsclite.node'),
    '7zip': path.resolve(__dirname, 'node_modules/win-7zip/index.js'), 
    sha3: path.join(__dirname,'node_modules/sha3/build/Release/sha3.node'),
    keccak: path.join(__dirname,'node_modules/keccak/build/Release/keccak.node')
  },
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
        use: 'native-ext-loader'
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
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
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
    new ExtractTextPlugin("style.css"),
    new HtmlWebpackPlugin( {
      filename: 'index.html',
      template: './src/ui/index.html',
      inject: 'body'
    })
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
        entry: { gui: './src/ui/Index.tsx' }
      },
      commonConfig)
  ]

