const {pushMsg, dbInstance, viewMore, $, imgwall, findLinks, ssl} = require('./utils');
const filter = 'jiyingw.com';
const hotkeys = {
  'jpmt': 'http://jiyingw.com/jpmt'
};
module.exports = {filter, action, hotkeys};

function action(uri) {
  switch(uri) {
    case 'http://jiyingw.com/jpmt': return albums();
    default: return page(uri);
  }
}

function albums() {
  return $('http://jiyingw.com/jpmt')
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.ikmoe-xc-bk').each((i, e) => {
        if(imgs.length >= 10) return;
        const $e = $(e);
        imgs.push({
          text: $e.find('img').attr('alt').substring(0, 12),
          src: ssl($e.find('img').attr('data-lazy-src')),
          link: $($e.find('a').get(1)).attr('href')
        });
      });

      return {title, imgs};
    })
    .then(imgwall);
}

function page(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('#post_content img').each((i, e) => {
        const src = $(e).attr('data-lazy-src');
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
