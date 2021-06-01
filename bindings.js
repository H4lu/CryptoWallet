const path = require('path')


module.exports = exports = function (str) {
  console.log(str)
  console.log("BINDINGS")
  console.log(__dirname)
  if (str === 'binding') {
    const result = require('./node_modules/ref-napi/build/Release/binding.node')
    result.path = './node_modules/ref-napi/build/Release/binding.node'
    return result
  } else if (str === 'ffi_bindings.node') {
    const result = require('./node_modules/ffi-napi/build/Release/ffi_bindings.node')
    result.path = './node_modules/ffi-napi/build/Release/ffi_bindings.node'
    return result
  } else if (str === "pcsclite") {
    const result = require('./node_modules/@pokusew/pcsclite/build/Release/pcsclite.node')
    result.path = './node_modules/@pokusew/pcsclite/build/Release/pcsclite.node'
    return result
  }
 
}
// }
// /*
// module.exports = exports = function (str) {
//   if (str === 'pcsclite.node') {
//     const result = require('./node_modules/pcsclite/build/Release/pcsclite.node')
//     result.path = path.resolve(__dirname, 'node_modules/pcsclite/build/Release/pcsclite.node')
//     return result
//   }
// }

