module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  target: 'electron-main',
 // entry: './src/index.ts',
  entry: {
    main: './src/index.ts',
    pcsc: './src/pcsc.ts'
  },
  output: {
    filename: "[name].js"
  },
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};