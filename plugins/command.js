const axios = require('axios');
const cheerio = require('cheerio');
const {$, imgwall, debug, ssl, shareData} = require('./utils');
const goo = require('./google');

const hotkeys = {
  'help': 'command:help',
  'download': 'command:download',
  '載': 'command:download',
  '抽': 'command:lottery',
};
const filter = 'command:';
module.exports = {filter, action, hotkeys};

function action(msg, fromId) {
  const cmd = msg.split(':')[1];
  switch(cmd) {
    case 'lottery': return lottery();
    case 'help': return help();
    case 'download': return download(fromId);
  }
  return null;
}

function download(fromId) {
  const msg = shareData['msg'][fromId];
  return Promise.resolve({
    type: 'text',
    text: msg.originalContentUrl
  });
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

