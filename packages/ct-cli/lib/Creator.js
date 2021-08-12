const EventEmitter = require('events');
const chalk = require('chalk');
const PackageManager = require('./PackageManager.js')
const writeFileTree = require('./util/writeFileTree.js')
const {hasCnpm,hasYarn,hasNpm,hasGit,hasProjectGit} = require('@ct/cli-shared-utils')
const execa = require('execa');
const Generator = require('./generator.js');
module.exports = class Creator extends EventEmitter{
  constructor(name,context) {
    super()
    this.name = name
    this.context = context
    this.plugins = []
  }
  // 正式创建逻辑
  /**
   * 
   * @param {object} cliOptions 
   * 内置插件为@ct/cli-ser
   */
  async create(cliOptions) {
    let context = this.context
    let name = this.name
    if (!cliOptions.plugin) {
      this.plugins.push('@ct/cli-ser')
    } else {
      this.plugins.push(cliOptions.plugin)
    }
    // 创建包管理器
    const pkgManager = (cliOptions.pkgManager || 
     (hasYarn() ? 'yarn': null) || 
     (hasCnpm() ? 'cnpm' : null) ||
     (hasNpm() ? 'npm' : null)
    )
    if(!pkgManager) {
      console.error(chalk.red(`npm&yarn&cnpm is not in process!`))
      process.exit(1)
    }
    const pm = new PackageManager({
      context, pkgManager
    })
    console.log(`✨  Creating project in ${chalk.yellow(context)}.`)
    this.emit('creation', { event: 'creating' })
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {},
    }
    this.plugins.forEach(item => {
      pkg.devDependencies[item] = 'latest'
    })
    // 写入package.json
    writeFileTree(this.context, {
      'package.json': JSON.stringify(pkg)
    })
    // 执行git init。
    let shouldInitGit = this.shouldInitGit(cliOptions)
    if (shouldInitGit) {
      console.log('init git reposityory...')
      this.emit('creation', {event: 'git-init'})
      await this.run('git init')
    }
    // 构建generator实例
    const generator = new Generator(context, {plugins: this.plugins, pkg:pkg}, {rootOptions: cliOptions})
    await generator.generate()
    this.emit('creation', {event: 'deps-install'})
    await pm.install()
    if (shouldInitGit) {
      await run('git add -A')
      try {
        await run('git', ['commit', '-m', 'init', '--no-verify'])
      } catch (e) {
        console.log(e)
      }
    }
    console.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
  }
  /**
   * 
   */
  shouldInitGit(cliOptions) {
    if (!hasGit()){
      return false
    }
    if (cliOptions.forceGit) {
      return true
    }
    return !hasProjectGit(this.context)
  }
  // 执行命令
  run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args, { cwd: this.context })
  }
}