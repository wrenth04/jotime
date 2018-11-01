const {ssl, $, imgwall, debug} = require('./utils');

const hotkeys = {
  'j777': 'j777-',
};
const filter = 'j777-';
module.exports = {filter, action, hotkeys};

function action(msg) {
  const keyword = encodeURIComponent(msg.split('-')[1]);
  return $(`http://www.jav777.cc/?s=${keyword}`)
    .then($ => {
      const imgs = [];
      $('.featured-media').each((i, e) => {
        if(i > 10) return;
        const $e = $(e);
        const link = $e.find('a').attr('href');
        const text = $e.find('a').attr('title').substring(0, 12);
        const imgset = $e.find('img').attr('srcset').split(' ');
        const src = ssl(imgset[imgset.length - 2]);
        imgs.push({link, text, src});
      });
      return {title: 'jav777 free video', imgs};
    })
    .then(imgwall);
}
