const {viewMore, $, imgwall, debug} = require('./utils');

const filter = 'pttnews.cc';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then($ => {
      const title = $('meta[property="og:title"]').attr('content');
      const imgs = [];
      $('.article-content img').each((i, e) => {
        if(i > 10) return;
        const src = 'https:' + $(e).attr('src');
        imgs.push({src, link: src});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
