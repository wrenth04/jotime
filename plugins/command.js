const axios = require('axios');
const cheerio = require('cheerio');
const {$, imgwall, debug, ssl} = require('./utils');
const goo = require('./google');

const hotkeys = {
  'help': 'command:help',
  '抽': 'command:抽',
};
const filter = 'command:';
module.exports = {filter, action, hotkeys};

function action(msg) {
  const cmd = msg.split(':')[1];
  switch(cmd) {
    case '抽': return lottery();
    case 'help': return help();
  }
  return null;
}

function help() {
  const {hotkeys, plugins} = require('.');
  const cmd1 = Object.keys(hotkeys);
  const cmd2 = plugins
    .filter(({filter}) => filter.indexOf('-') == filter.length -1)
    .map(({filter}) => filter);
  const cmds = cmd1.concat(cmd2);
  const text = cmds.join('\n');
  return Promise.resolve({
    type: 'text', text
  });
}

function lottery() {
  const r = Math.floor(Math.random()*1000);
  return goo.action('goo-正妹 '+r);
}

