const {debug, viewMore, $, imgwall, findLinks, ssl} = require('./utils');

const filter = 'gigacircle.com';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.usercontent>img').each((i, e) => {
        if(i > 10 ) return;
        const src = $(e).attr('src');
        imgs.push({src: ssl(src), link: src});
      });

      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
