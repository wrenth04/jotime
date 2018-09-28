const {viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'fun1shot';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('.article_img').each((i, e) => {
        if(i == 0 || i > 10) return;
        const src = link = $(e).attr('src');
        imgs.push({src, link});
      });

      return {title, imgs, links};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
