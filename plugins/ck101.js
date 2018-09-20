const axios = require('axios');
const cheerio = require('cheerio');
const {imgwall} = require('./utils');

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

      const igs = [];
      $('a').each((i, e) => {
        const link = $(e).attr('href');
        if(!link || link.indexOf('instagram.com') == -1) return;
        igs.push(link);
      });

      if(igs.length > 0) {
        imgs[0].text = 'ig';
        imgs[0].link = igs[0];
      }
      return {title, imgs};
    })
    .then(imgwall);
}

