const {debug, viewMore, $, imgwall, findLinks, ssl} = require('./utils');

const filter = 'gigacircle.com';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.usercontent img').each((i, e) => {
        if(imgs.length >= 10 ) return;
        const $e = $(e);
        const src = $e.attr('src') || $e.attr('data-original');
        if(!src) return;
        imgs.push({src: ssl(src), link: src});
      });

      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
