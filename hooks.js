module.exports = {
    postPackage: async (forgeConfig, options) => {
        console.log("post package")
        console.log(forgeConfig)
        console.log(options)
    },
    prePackage: async (forgeConfig, options) => {
        console.log("pre package")
        console.log(forgeConfig)
        console.log(options)
    },
    preMake: async (forgeConfig, options) => {
        console.log("pre make")
        console.log(forgeConfig)
        console.log(options)
    },
    postMake: async(make) => {
        console.log("post make")
        console.log(make)
    }
}
