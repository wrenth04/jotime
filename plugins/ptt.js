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
      const imgs = [];
      $('#main-content a').each((i, e) => {
        const href = $(e).attr('href');
        if(href.indexOf('imgur') == -1) return;
        const id = href.split('/')[3].split('.')[0];
        imgs.push({
          src: `https://i.imgur.com/${id}h.jpg`,
          link: `https://i.imgur.com/${id}.jpg`
        });
      });

      return {title, imgs};
    })
    .then(imgwall);
}
