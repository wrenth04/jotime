const axios = require('axios');
const cheerio = require('cheerio');
const imgwall = require('./imgwall');

const filter = 'ck101';
module.exports = {filter, action};

function action(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('img[itemprop="image"]').each((i, e) => {
        if(i == 0 || i > 10) return;
        const src = link = $(e).attr('file');
        imgs.push({src, link});
      });

      return {title, imgs};
    })
    .then(imgwall);
}

