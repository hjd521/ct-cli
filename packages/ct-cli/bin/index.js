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
// generate pulug code
program.command('plugin <plugin-name>')
  .description('create a new plugin, Automatic prefix < @ct/cli- > ')
  .action((name) => {
    require('../lib/plugin/index.js')(name)
  }
)
// add plugin
program.command('add <plugin-name>')
  .description('add plugin to @ct/cli')
  .action((name) => {
    require('../lib/add.js')(name)
  }
)
// remove plugin
program.command('remove <plugin-name>')
  .description('remove plugin from @ct/cli')
  .action((name) => {
    require('../lib/remove.js')(name)
  }
)
// clear plugins
program.command('clear')
  .description('remove all plugins from @ct/cli')
  .action((name) => {
    require('../lib/clear.js')(name)
  }
)
// 监听所有命令
program.on('command:*', function(args) {
  require('../lib/plugin/index.js')(args[1], args[0])
})
program.parse(process.argv)

