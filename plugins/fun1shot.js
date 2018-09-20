const axios = require('axios');
const cheerio = require('cheerio');
const {imgwall} = require('./utils');

const filter = 'fun1shot';
module.exports = {filter, action};

function action(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.article_img').each((i, e) => {
        if(i == 0 || i > 10) return;
        const src = link = $(e).attr('src');
        imgs.push({src, link});
      });

      return {title, imgs};
    })
    .then(imgwall);
}
