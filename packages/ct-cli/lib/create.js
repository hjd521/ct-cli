const Creator = require('./Creator');
const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
// 定义名称，以及操作的目录,options为后期扩展
/**
 * 
 * @param {string} appName 
 * @param {object} options
 * 获取当前目录，项目名称，
 * 判断当前目录是否存在
 * 判断name是否符合规范
 */
async function create(appName,options = {}) {
  let cwd = options.cwd || process.cwd() // 获取当前目录
  const name = appName || 'app' // 获取项目名称
  const targetDir = path.resolve(cwd, name || '.')
  const result = validateProjectName(name) // 获取项目名称是否合法
  if(!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    process.exit(1)
  }
  if (fs.existsSync(targetDir)) {
    let {action} = await inquirer.prompt([{
      type: 'confirm',
      name: 'action',
      message: 'dir is existed, are you sure to overwrite',
    }])
    if (!action) {
      process.exit(1)
    } else {
      await fs.remove(targetDir)
    }
  }
  const creator = new Creator(name, targetDir, options) // 创建项目创造器
  creator.create(options)
}
module.exports = (...args) => {
  return create(...args).catch(err => {
    // stopSpinner(false)
    console.log(err)
    // 如果不为测试模式，则推出node进程。
    if (!process.env.CLI_TEST) {
      process.exit(1)
    }
  })
}