const {ssl, viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'reddit.com';
module.exports = {filter, action};

function action(uri) {
console.log(1);
  return $(uri, {headers: {cookie: 'over18=1'}})
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('img').each((i, e) => {
        if(imgs.length > 10 ) return;
        let src = $(e).attr('src');
        if(!src || src.indexOf('external-preview') == -1) return;
        src = src.replace(/&amp;/g, '&');
        imgs.push({src, link: src});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
