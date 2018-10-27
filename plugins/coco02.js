const {ssl, viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'www.coco0';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('.p-img img').each((i, e) => {
        if(i > 10 ) return;
        let src = $(e).attr('src')
          .replace('coco02', 'coco01');
        if(src.indexOf('coco01') != -1)
          src = src.replace('http', 'https');
        imgs.push({src: ssl(src), link: src});
      });
      return {title, imgs, links};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
