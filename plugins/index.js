const fs = require('fs');

const hotkeys = {};
const plugins = [];

module.exports = {hotkeys, plugins};

fs.readdirSync('./plugins')
  .filter(f => f.indexOf('.js') != -1 && f.indexOf('.') != 0 && f != 'index.js')
  .map(f => {
    const p = require('./'+f);
    if(p.filter) plugins.push(p);
    const pk = p.hotkeys || {};
    Object.keys(pk).forEach(k => hotkeys[k] = pk[k]);
  });
