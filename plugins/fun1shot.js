const axios = require('axios');
const cheerio = require('cheerio');
const imgwall = require('./imgwall');

const filter = 'fun1shot';
module.exports = {filter, action};

function action(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.article_img').each((i, e) => {
        const src = link = $(e).attr('src');
        imgs.push({src, link});
      });

      return {title, imgs};
    })
    .then(imgwall);
}
