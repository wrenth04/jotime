const {viewMore, ssl, debug, $, imgwall, findLinks} = require('./utils');

const filter = 'funnywithyou.life';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('.figure img').each((i, e) => {
        const src = 'http://www.funnywithyou.life' + $(e).attr('src');
        imgs.push({
          src: ssl(src),
          link: src
        });
      });

      return {title, imgs, links};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
