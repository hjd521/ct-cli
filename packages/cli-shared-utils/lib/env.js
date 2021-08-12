const { execSync } = require('child_process')
let _hasGit,_hasCnpm,_hasNpm,_hasYarn
let _gitProjects = new Map()
// 检测系统是否已经安装了yarn
exports.hasYarn = () => {
  if (process.env.VUE_CLI_TEST) {
    return true
  }
  if (_hasYarn != null) {
    return _hasYarn
  }
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return (_hasYarn = true)
  } catch (e) {
    return (_hasYarn = false)
  }
}
// 检测系统是否已经安装了git
exports.hasGit = () => {
  if (process.env.VUE_CLI_TEST) {
    return true
  }
  if (_hasGit != null) {
    return _hasGit
  }
  try {
    execSync('git --version', { stdio: 'ignore' })
    return (_hasGit = true)
  } catch (e) {
    return (_hasGit = false)
  }
}
// 检测系统是否已经安装了cnpm
exports.hasCnpm = () => {
  if (process.env.VUE_CLI_TEST) {
    return true
  }
  if (_hasCnpm != null) {
    return _hasCnpm
  }
  try {
    execSync('cnpm --version', { stdio: 'ignore' })
    return (_hasCnpm = true)
  } catch (e) {
    return (_hasCnpm = false)
  }
}
// 检测系统是否已经安装了npm
exports.hasNpm = () => {
  if (process.env.VUE_CLI_TEST) {
    return true
  }
  if (_hasNpm != null) {
    return _hasNpm
  }
  try {
    execSync('npm --version', { stdio: 'ignore' })
    return (_hasNpm = true)
  } catch (e) {
    return (_hasNpm = false)
  }
}
// 检测当前目录是否已经有git了
exports.hasProjectGit = (cwd) => {
  if (_gitProjects.has(cwd)) {
    return _gitProjects.get(cwd)
  }
  let result
  try {
    execSync('git status', { stdio: 'ignore', cwd })
    result = true
  } catch (e) {
    result = false
  }
  _gitProjects.set(cwd, result)
  return result
}
// 检测当前包是否应被发不了
exports.hasNpmPkg = (name) => {
  try {
    execSync('npm search', [`${name}`])
    true
  }catch(err) {
    return false
  }
}