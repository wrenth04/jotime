const {viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'ck101';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('meta[property="og:title"]').attr('content');
      const imgs = [];
      $('img[itemprop="image"]').each((i, e) => {
        if(i == 0 || i > 10) return;
        const src = link = $(e).attr('file');
        imgs.push({src, link});
      });

      return {title, imgs, links};
    })
    .then(viewMore(uri))
    .then(imgwall);
}

