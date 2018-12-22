const {ssl, viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'clickme.net';
module.exports = {filter, action};

function action(uri) {
console.log(1);
  return $(uri)
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('article img').each((i, e) => {
        if(imgs.length > 10 ) return;
        let src = $(e).attr('src');
        if(!src) return;
        src = 'https:'+src.replace(/&amp;/g, '&');
        imgs.push({src, link: src});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
