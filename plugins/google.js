const axios = require('axios');
const cheerio = require('cheerio');
const {$, imgwall, debug, ssl} = require('./utils');

const filter = 'goo-';
module.exports = {filter, action};

function action(msg) {
  const keyword = encodeURIComponent(msg.split('-')[1]);
  return axios.get(`https://www.google.com/search?q=${keyword}&tbm=isch&tbs=itp:face,qdr:w`, {headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'}})
    .then(res => cheerio.load(res.data))
    .then($ => {
      const imgs = [];
      $('.rg_meta').each((i, e) => {
        if(i > 10) return;
        const meta = JSON.parse($(e).text());
        imgs.push({
          text: meta.pt.substr(0, 12),
          src: ssl(meta.ou),
          link: meta.ru
        });
      });
      return {imgs, title: 'jotime'};
    })
    .then(imgwall);
}

