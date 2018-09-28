const {viewMore, $, imgwall, findLinks} = require('./utils');

const filter = 'www.ptt.cc/bbs';
module.exports = {filter, action};

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('#main-content>a').each((i, e) => {
        const href = $(e).attr('href');
        if(href.indexOf('imgur') == -1) return;
        const id = href.split('/')[3].split('.')[0];
        imgs.push({
          src: `https://i.imgur.com/${id}h.jpg`,
          link: `https://i.imgur.com/${id}.jpg`
        });
      });

      return {title, imgs, links};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
