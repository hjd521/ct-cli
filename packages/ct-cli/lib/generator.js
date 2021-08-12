let {isPlugin, loadModule} = require('@ct/cli-shared-utils')
let GeneratorAPI = require('./generatorAPI.js')
const writeFileTree = require('./util/writeFileTree.js')
module.exports = class Generator {
  constructor(context, {plugins = [], pkg}, {rootOptions}) {
    this.plugins = plugins
    this.context = context
    this.pkg = pkg
    this.fileMiddlewares = []
    this.files = {}
    this.rootOptions = rootOptions
    this.allPlugins = this.resolvePlugins()
  }
  // 拿到plugin的具体功能函数，以及id组成数组返回
  resolvePlugins() {
    const plugins = []
    Object.keys(this.pkg.dependencies || {}).concat(Object.keys(this.pkg.devDependencies || {})).forEach((id) => {
      if (isPlugin(id)) {
        const pluginGenerator = loadModule(`${id}/generator`, this.context)
        if (!pluginGenerator) {
          return
        }
        plugins.push({id,apply: pluginGenerator})
      }
    })
    return plugins
  }
   // 遍历插件生成遍历器，执行插件的apply方法
  async initPlugins() {
    for (const plugin of this.allPlugins) {
      const {id, apply} = plugin
      const api = new GeneratorAPI(id, this)
      await apply(api)
    }
  }
  // 执行插件数组生成文件
  async resolveFiles() {
    const files = this.files
    for (const middleware of this.fileMiddlewares) {
      await middleware(files)
    }
  }
  async generate() {
    await this.initPlugins()// 将插件的具体渲染函数放到fileMiddlewares数组中
    await this.resolveFiles()
    // this.files['package.json'] = JSON.stringify(this.pkg, null, 2)
    await writeFileTree(this.context, this.files)
  }
}