module.exports = [
  // // Add support for native node modules
  // {
  //   test: /\.node$/,
  //   use: 'node-loader',
  // },
  // {
  //   test: /\.(m?js|node)$/,
  //   parser: { amd: false },
  //   use: {
  //     loader: '@marshallofsound/webpack-asset-relocator-loader',
  //     options: {
  //       outputAssetBase: 'native_modules',
  //     },
  //   },
  // },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        onlyCompileBundledFiles: true
      }
    }
  },  
    {
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use : [
          {loader: 'file-loader',
           options: {
               name : 'assets/[name].[contenthash].[ext]',
          } 
          }
      ]
    }
];
