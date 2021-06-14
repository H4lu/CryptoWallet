const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = {
    readPackageJson: async (forgeConfig, packageJson) => {
        packageJson.dependencies["ffi-napi"] = "^4.0.3"
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
                    resolve()
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
