'use strict';
['env', 'plugin', 'module'].forEach(name => {
    Object.assign(exports, require(`./${name}.js`))
})
