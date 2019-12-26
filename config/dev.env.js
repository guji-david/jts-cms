var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"/api/console"',
  PC_ROOT:'"https://alpha-www.jintoushou.com"',
  FILE_NAME:'dev'
})
