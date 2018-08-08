'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  TEST_URL: '"//192.168.1.99:8080"', 
  API_ROOT: '"//capitest.kdyoupin.com"',
  API_ROOT1: '"//capi.kdyoupin.com"'
})
