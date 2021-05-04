const {ssl, viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'sharefie.net';
module.exports = {filter, action};

function action(uri) {
console.log(1);
  return $(uri)
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('#postcontent img').each((i, e) => {
        if(imgs.length > 10 ) return;
        let src = $(e).attr('data-src');
        if(!src) return;
        imgs.push({src, link: src});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
