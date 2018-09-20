const {$, imgwall, findLinks} = require('./utils');

const filter = 'www.coco0';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('.p-img img').each((i, e) => {
        const src = $(e).attr('src')
          .replace('coco02', 'coco01')
          .replace('http', 'https');
        if(src.indexOf('coco01') == -1) return;
        imgs.push({src, link: src});
      });
      return {title, imgs, links};
    })
    .then(imgwall);
}
