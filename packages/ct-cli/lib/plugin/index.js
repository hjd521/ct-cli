
let {isPlugin, hasNpmPkg} = require('@ct/cli-shared-utils');
let pgkPre = '@ct/cli-'
let inquirer = require('inquirer');
let originName
module.exports = async function(name, pluginName = null) {
  originName = name
  if(!isPlugin(name)) {
    name = pgkPre + name
  }
  // normalize pluginName
  if (pluginName && !isPlugin(name)) {
    pluginName = pgkPre + pluginName
    require('../create.js')(originName,{plugin: pluginName, name: name})
  } else {
    checkIsUse(name)
  }
  
}
async function getPkgName() {
  let answer = await inquirer.prompt([
    {
      type: 'input',
      message: 'your plugin name is already in use, pleace input others',
      name: 'name'
    }
  ])
  return answer.name
}
async function checkIsUse(name) {
  if (hasNpmPkg(name)) {
    name  = await getPkgName()
    checkIsUse(name)
  } else {
    require('../create.js')(originName,{plugin: '@ct/cli-pluginer', name: name})
  }
}