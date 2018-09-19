const fs = require('fs');

module.exports = fs.readdirSync('./plugins')
  .filter(f => f.indexOf('.js') != -1 && f.indexOf('.') != 0 && f != 'index.js')
  .map(f => require('./'+f));
