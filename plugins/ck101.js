const axios = require('axios');
const cheerio = require('cheerio');
const {imgwall, findIg} = require('./utils');

const filter = 'ck101';
module.exports = {filter, action};

function action(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then(findIg)
    .then(({$, igs}) => {
      const title = $('meta[property="og:title"]').attr('content');
      const imgs = [];
      $('img[itemprop="image"]').each((i, e) => {
        if(i == 0 || i > 10) return;
        const src = link = $(e).attr('file');
        imgs.push({src, link});
      });

      const last = imgs.length > 1 ? imgs[imgs.length - 1] : imgs[0];
      last.text = 'view more';
      last.link = uri;

      return {title, imgs, igs};
    })
    .then(imgwall);
}

