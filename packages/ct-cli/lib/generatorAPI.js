const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const isString = val => typeof val === 'string'
const { isBinaryFileSync } = require('isbinaryfile')
class GeneratorAPI {
  constructor(id, generator, options) {
    this.id = id
    this.generator = generator
    this.options = options
  }
  // 将插件需要渲染的模板包装秤函数放入处理数组中
  render(source, options) {
    const baseDir = extractCallDir()
    if (isString(source)) {
      source = path.resolve(baseDir, source)
      this._injectFileMiddleware(async (files) => {
        const globby = require('globby')
        const _files = await globby(['**/*'], { cwd: source, dot: true })
        for (const rawPath of _files) {
          const targetPath = rawPath.split('/').map(filename => {
            // dotfiles are ignored when published to npm, therefore in templates
            // we need to use underscore instead (e.g. "_gitignore")
            if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
              return `.${filename.slice(1)}`
            }
            if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
              return `${filename.slice(1)}`
            }
            return filename
          }).join('/')
          const sourcePath = path.resolve(source, rawPath)
          let name = this.generator.rootOptions.name
          options = Object.assign({name}, options)
          const content = renderFile(sourcePath, options)
          // only set file if it's not all whitespace, or is a Buffer (binary files)
          if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
            files[targetPath] = content
          }
        }
      })
    }
  }
  _injectFileMiddleware(middleware) {
    this.generator.fileMiddlewares.push(middleware)
  }
}
// 找到当前函数执行的文件上的目录
function extractCallDir() {
  // extract api.render() callsite file location using error stack
  const obj = {}
  Error.captureStackTrace(obj)
  const callSite = obj.stack.split('\n')[3]
  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/

  let matchResult = callSite.match(namedStackRegExp)
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp)
  }
  const fileName = matchResult[1]
  return path.dirname(fileName)
}
// 找到文件对应的内容
function renderFile (name, data, ejsOptions) {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name) // return buffer
  }
  const template = fs.readFileSync(name, 'utf-8')
  return ejs.render(template, {content: data}, ejsOptions)
}
module.exports = GeneratorAPI