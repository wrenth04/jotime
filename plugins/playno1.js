const {ssl, viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'playno1.com';
module.exports = {filter, action};

function action(uri) {
console.log(1);
  return $(uri, {headers: {cookie: 'playno1=playno1Cookie'}})
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('img').each((i, e) => {
        if(imgs.length > 10 ) return;
        if(!$(e).attr('onload')) return;
        let src = $(e).attr('src');
        if(!src) return;
        src = src.replace(/&amp;/g, '&');
        imgs.push({src, link: src});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
