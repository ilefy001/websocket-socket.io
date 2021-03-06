var thinkjs = require('thinkjs');
var path = require('path');

var rootPath = path.dirname(__dirname);

var instance = new thinkjs({
  APP_PATH: rootPath + '/app',
  ROOT_PATH: rootPath,
  RUNTIME_PATH: rootPath + '/runtime',
  RESOURCE_PATH: __dirname,
  env: 'development'
});
instance.compile(true);
instance.run();