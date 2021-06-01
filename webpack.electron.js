const path = require('path');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, 'src/main-process/Main.ts'),
    optimization: {
        minimize: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    target: 'electron-main',
    resolve: {
        extensions: ['.js', '.ts']
    },
  
    module : {
        rules: [
            {
                test: /\.ts$/,
                use: [{loader: 'ts-loader', options: {onlyCompileBundledFiles: true}}]
            }
        ]
    }

}
