const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {isPlugin, pluginRE} = require('@ct/cli-shared-utils');
let pluginPath = path.resolve(__dirname, '../plugin/pluginList.json')
let content = fs.readFileSync(pluginPath, 'utf8');
const inquirer = require('inquirer');
content = JSON.parse(content)
// judge plugin if exist
function hasPlugin(name) {
  return content[name]
}
// add plugin
function addPlugin(name) {
  let commandName
  if (isPlugin(name)) {
    let result = name.match(pluginRE)
    commandName = result[2]
  } else {
    console.log(chalk.red(`${name} is not standard, muse be @ct/cli-<name>`))
    process.exit(1)
  }
  if (hasPlugin(name)) {
    console.log(chalk.yellow(`${name} plugin is existed, don't repeat add`))
    process.exit(1)
  }
  content[name] = commandName
  fs.writeFileSync(pluginPath, JSON.stringify(content), 'utf-8')
  console.log(`🎉  Successfully add plugin ${chalk.yellow(name)}.`)
}
// delete plugin
function removePlugin(name) {
  if (!isPlugin(name) || !hasPlugin(name)) {
    console.log(chalk.red(`${red} is not invalid or not in plugins`))
  } else {
    delete content[name]
  }
  fs.writeFileSync(pluginPath, JSON.stringify(content), 'utf-8')
  console.log(`🎉  Successfully remove plugin ${chalk.yellow(name)}.`)
}
// clear plugins
async function  clearPlugin() {
  let answer = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'are you sure to clear plugins',
      name: 'result'
    }
  ])
  if (answer.result) {
    content = {}
    fs.writeFileSync(pluginPath, JSON.stringify(content), 'utf-8')
    console.log(`🎉  Successfully remove  all plugins`)
  }
}
module.exports = {
  hasPlugin,
  addPlugin,
  removePlugin,
  clearPlugin
}