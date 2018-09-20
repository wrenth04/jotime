const {$, imgwall, findLinks} = require('./utils');

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

      const last = imgs.length > 1 ? imgs[imgs.length - 1] : imgs[0];
      last.text = 'view more';
      last.link = uri;

      return {title, imgs, links};
    })
    .then(imgwall);
}

