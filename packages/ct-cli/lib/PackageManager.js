const EventEmitter = require('events');
const execa = require('execa');
const pkg_manage_config = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    add: ['install', '--loglevel', 'error'],
    upgrade: ['update', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error']
  },
  yarn: {
    install: [],
    add: ['add'],
    upgrade: ['upgrade'],
    remove: ['remove']
  }
}
module.exports = class PackageManager extends EventEmitter {
  constructor({ context, pkgManager }) {
    super()
    this.context = context
    this.pkgManager = pkgManager
    this.bin = pkgManager
  }
  async runCommand(command, args) {
    await execa(this.bin, [...pkg_manage_config[this.bin][command], ...(args || [])],
      this.context
    )
  }
  async install(args) {
    return await this.runCommand('install', args)
  }
}