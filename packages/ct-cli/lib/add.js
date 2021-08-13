// 新增插件到pluginList.json中
const {addPlugin} = require('./util/plugin.js');
module.exports  = function(name) {
  addPlugin(name)
}