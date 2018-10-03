const axios = require('axios');
const cheerio = require('cheerio');
const {$, imgwall, debug, ssl} = require('./utils');
const goo = require('./google');

const hotkeys = {
  '抽': 'command:抽',
};
const filter = 'command:';
module.exports = {filter, action, hotkeys};

function action(msg) {
  const cmd = msg.split(':')[1];
  switch(cmd) {
    case '抽': return lottery();
  }
  return null;
}

function lottery() {
  const r = Math.floor(Math.random()*1000);
  return goo.action('goo-正妹 '+r);
}

