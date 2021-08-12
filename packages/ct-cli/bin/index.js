#!/usr/bin/env node

const program = require('commander');
// 设置版本
program.version(`ct-cli${require('../package.json').version}`).parse(process.argv)
.usage('<command> [options]')
// 生成项目
program
.command('create <app-name>')
.description('create a new project')
.action((name) => {
  require('../lib/create.js')(name)
})
program.command('plugin <plugin-name>')
.description('create a new plugin, Automatic prefix < @ct/cli- > ')
.action((name) => {
  require('../lib/plugin/index.js')(name)
})
program.parse(process.argv)

