const {viewMore, $, imgwall, debug} = require('./utils');

const filter = 'jkforum.net';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.zoom').each((i, e) => {
        const src = link = $(e).attr('zoomfile');
        if(i > 10) return;
        imgs.push({src, link});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
