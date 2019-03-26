{
  "productName": "CryptoWallet",
  "appId": "by.citeh.CryptoWallet",
  "asar": "true",
  "directories": {
    "output": "dist"
  },
  "main": "/dist/main.js"
  "files": [
     "dist/**",
     "static/**",
     "!webpack.config.js"
    "!*.ts",
    "!*.code-workspace",
    "!LICENSE.md",
    "!package.json",
    "!package-lock.json",
    "!src/",
    "!hooks/",
    "!.angular-cli.json",
    "!_config.yml",
    "!karma.conf.js",
    "!tsconfig.json",
    "!tslint.json"
  ],
  "win": {
    "target": ["nsis"]
  },
  "mac": {
  },
  "linux": {
    "category": "Utility",
    "target": ["deb"]
  }
}