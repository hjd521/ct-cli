const pluginRE = /^(@ct\/cli)-/
exports.isPlugin = id => pluginRE.test(id)