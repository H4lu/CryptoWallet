const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const threadLoader = require('thread-loader');


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
module : {
  rules: [
    {
      test: /\.ts?$/,
      enforce: 'pre',
  
       use:[ { loader: 'cache-loader' },
        {
            loader: 'thread-loader',
            options: {
                // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                workers: 2,
                workerParallelJobs: 50,
                workerNodeArgs:['--stack_size=8192', '--max-old-space-size=4080'],
                poolParallelJobs: 300,
                name: "ts-pool"
            },
        },
        {
            loader: 'ts-loader',
            options: {
                happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            }
        }
            
    ]
    },
      // {
      //   test: /\.ts?$/,
      //   enforce: 'pre',
      //   use: 'happypack/loader?id=tsx'
    
      // },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use : [
          { loader: 'cache-loader' },
          {  loader: 'file-loader',
              options: {
                name : 'assets/images/[name].[ext]',
  
          } 
        }
        ]
         
        
       
        
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          }
        ]
      
      },
      {
        test: /\.node$/,
        loader: 'native-ext-loader'
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [{ 
        loader: 'cache-loader'
       },
       {
       loader: 'thread-loader',
       options: {
           // there should be 1 cpu for the fork-ts-checker-webpack-plugin
           workers: 2,
           workerParallelJobs: 50,
           workerNodeArgs:['--stack_size=8192', '--max-old-space-size=4080'],
           poolParallelJobs: 300,
           name: "ts-pool"
       }
      },
          { 
            loader:  'babel-loader'
           },
           
          { 
            loader: 'ts-loader',
            options: {
              happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
          }
           }
     ]
    },
      // {
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   use: 'happypack/loader',
      //   options: {
      //     typeCheck: true,
      //     emitErrors: true,
      //   }
      // },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use:[ 
          {
             loader: 'cache-loader'
          },
        {
            loader: 'thread-loader',
            options: {
                // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                workers: 2,
                workerParallelJobs: 50,
                workerNodeArgs:['--stack_size=8192', '--max-old-space-size=4080'],
                poolParallelJobs: 300,
                name: "ts-pool"
            }
        },
        {  
           loader: 'standard-loader'
      }   
       ]
      },
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: 'style-loader'
      //     },
      //     {
      //       loader: 'css-loader'
      //     }
      //   ]
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
       // use: ['thread-loader','babel-loader']
       use:[ { loader: 'cache-loader' },
       {
           loader: 'thread-loader',
           options: {
               // there should be 1 cpu for the fork-ts-checker-webpack-plugin
               workers: 2,
               workerParallelJobs: 50,
               workerNodeArgs:['--stack_size=8192', '--max-old-space-size=4080'],
               poolParallelJobs: 300,
               name: "ts-pool"
           },
       },
       {
           loader: 'babel-loader'
       }
           
   ]
      },
      {
        test: /tar[\\\/].*\.js$/,
        loader: 'babel-loader!octal-number-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.NormalModuleReplacementPlugin(
        /^bindings$/,
        require.resolve("./bindings")
    ),
    new  webpack.NormalModuleReplacementPlugin(
      /^any-promise$/,
      require.resolve('bluebird')
    ),
    new HtmlWebpackPlugin( {
      filename: 'index.html',
      template: './src/ui/index.html',
      inject: 'body'
    }),
   
   // new CleanWebpackPlugin(['dist'], {  watch: true }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
 
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
