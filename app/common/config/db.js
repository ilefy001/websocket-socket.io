'use strict';
/**
 * db config
 * @type {Object}
 */exports.__esModule = true;exports['default'] = 
{ 
  type: 'mysql', 
  host: '127.0.0.1', 
  port: '3306',
  database: 'demo',
  user: 'root', 
  pwd: '', 
  prefix: '', 
  encoding: 'utf8', 
  nums_per_page: 10, 
  log_sql: true, 
  log_connect: true, 
  cache: { 
    on: true, 
    type: '', 
    timeout: 3600 } };module.exports = exports['default'];