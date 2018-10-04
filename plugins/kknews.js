const {$, imgwall, debug} = require('./utils');

const filter = 'kknews.cc';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then($ => {
      const imgs = [];
      const title = $('meta[property="og:title"]').attr('content');
      $('meta[property="og:image"]').each((i, e) => {
        if(i > 10) return;
        const src = $(e).attr('content');
        imgs.push({src});
      });
      return {title, imgs};
    })
    .then(imgwall);
}
