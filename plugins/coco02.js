const axios = require('axios');
const cheerio = require('cheerio');
const {imgwall} = require('./utils');

const filter = 'www.coco0';
module.exports = {filter, action};

function action(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.p-img img').each((i, e) => {
        const src = $(e).attr('src')
          .replace('coco02', 'coco01')
          .replace('http', 'https');
        if(src.indexOf('coco01') == -1) return;
        imgs.push({src, link: src});
      });
      return {title, imgs};
    })
    .then(imgwall);
}
