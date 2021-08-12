const Module = require('module')
const path = require('path')
const createRequire = Module.createRequire || Module.createRequireFromPath || function (filename) {
  const mod = new Module(filename, null)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))

  mod._compile(`module.exports = require;`, filename)

  return mod.exports
}
exports.loadModule = function (request, context) {
  // createRequire doesn't work with jest mocked fs
  // (which we used in tests for cli-service)
  if (process.env.VUE_CLI_TEST && context === '/') {
    return require(request)
  }

  try {
    return createRequire(path.resolve(context, 'package.json'))(request)
  } catch (e) {
    return require.resolve(request, {paths: [context]})
  }
}