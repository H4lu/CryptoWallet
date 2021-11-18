const { spawn, exec } = require ('child_process')
const fs = require ('fs')
const path = require('path')
const { rebuild } = require('electron-rebuild')
const electron = require('electron')

module.exports = {
    readPackageJson: async (forgeConfig, packageJson) => {
        packageJson.dependencies["ffi-napi"] = "^4.0.3"
        packageJson.dependencies["@pokusew/pcsclite"] =  "0.6.0"
        packageJson.dependencies["@ethereumjs/tx"] = "^3.2.0"
        packageJson.dependencies["rlp"] = "2.0.0"
        packageJson.dependencies["satoshi-bitcoin"] = "1.0.4"
        packageJson.dependencies["js-sha3"] = "0.8.0"
        packageJson.dependencies["axios"] = "^0.21.1"
        packageJson.dependencies["bitcoinjs-lib"] = "3.3.0"
        packageJson.dependencies["utf-8-validate"] = "^5.0.5"
        packageJson.dependencies["web3"] = "^1.3.6"
    },
    packageAfterPrune: async (forgeConfig, buildPath) => {
        console.log(buildPath)
        await fs.promises.copyFile(
            path.join(__dirname, 'resources/lib32.dll'),
            path.join(buildPath, '../lib32.dll')
        )
        return new Promise((resolve, reject) => {
            const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
            const npmInstall = spawn(command, ["install"], {
                cwd: buildPath,
                stdio: 'inherit'
            })
    
            npmInstall.on('close', code => {
                if (code === 0) {
                    rebuild({buildPath: buildPath, electronVersion: "13.1.1"})
                        .then(() => {
                            console.log("\nProduction dependencies are rebuilded!\n")
                            resolve()
                        }).catch(err => {
                            console.log(err.message)
                            reject()
                        })
                    // const rebuild = spawn("electron-forge rebuild", {
                    //     cwd: buildPath,
                    //     stdio: 'inherit'
                    // })
                    // rebuild.on('close', rebuildCode => {
                    //     if (rebuildCode === 0) {
                    //         resolve()
                    //     } else {
                    //         reject(new Error('Process finished with code: ' + code))
                    //     }
                    // })
                } else {
                    reject(new Error('Process finished with code: ' + code))
                }
            })

            npmInstall.on('error', error => {
                reject(error)
            })
        })
    }
}
