const {Compilation, sources} = require('webpack')
const { spawn } = require('child_process')

class CompileTs {
  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync('CompileTs', (compilation, callback) => {
      console.log("\nAFTER COMPILE\n")
      const proc = spawn('npx tsc -m commonjs', {
        shell: true
      })
      proc.on('exit', () => {
        console.log("\nCOMPILE CALLBACK\n")
        callback()
      })
    })
  }
}

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */

  plugins: [new CompileTs()],
  target: 'electron-main',
  entry: {
    main: './src/index.ts',
    // pcsc: './src/pcsc.ts'
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
  }
};