const axios = require('axios');
const cheerio = require('cheerio');
const imgwall = require('./imgwall');

const filter = 'www.ptt.cc/bbs';
module.exports = {filter, action};

function action(uri) {
    return axios.get(uri, {headers: {cookie: 'over18=1'}})
      .then(res => cheerio.load(res.data))
      .then($ => {
        const title = $('title').text();
        const imgs = $('#main-content a')
        .text()
        .split('http')
        .filter(e => e.indexOf('imgur') != -1)
        .map(e => e.split('/')[3].split('.')[0])
        .map(id => ({
          src: `https://i.imgur.com/${id}h.jpg`,
          link: `https://i.imgur.com/${id}.jpg`
        }));
        return {title, imgs};
      })
      .then(imgwall);
}
